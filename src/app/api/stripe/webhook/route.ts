import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseService } from "@/lib/supabase";
import { sendOrderNotification } from "@/lib/gmail";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export async function POST(req: Request) {
  if (!supabaseService) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const headerList = await headers();
  const signature = headerList.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing stripe signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const metadata = session.metadata || {};
    const productName = metadata.productName || "Unknown product";
    const roastLabel = metadata.roastId || metadata.roast || "unknown";
    const gram = Number(metadata.gram || 0);
    const qty = Number(metadata.qty || 1);

    const totalAmount = Math.round((session.amount_total || 0) / 100);
    const customerEmail =
      session.customer_details?.email ||
      metadata.customerEmail ||
      "unknown@example.com";

    let tasteStart: Date | null = null;
    let tasteEnd: Date | null = null;
    let expiryDate: Date | null = null;
    if (metadata.roastId) {
      const { data: roastRow } = await supabaseService
        .from("roast_profiles")
        .select("*")
        .eq("id", metadata.roastId)
        .maybeSingle();

      if (roastRow) {
        const baseDate = new Date();
        tasteStart = addDays(baseDate, roastRow.taste_start_days);
        tasteEnd = addDays(baseDate, roastRow.taste_end_days);
        expiryDate = addDays(baseDate, roastRow.expiry_days);
      }
    }

    const { data: beanRow } = await supabaseService
      .from("bean_stocks")
      .select("id, bean_name, stock_grams")
      .eq("bean_name", productName)
      .maybeSingle();

    const { data: createdOrder, error: orderError } = await supabaseService
      .from("orders")
      .insert({
        email: customerEmail,
        total_amount: totalAmount,
        status: "paid",
        roasted_at: null,
      })
      .select("id")
      .single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    const orderId = createdOrder?.id as string | undefined;
    const unitPrice = qty > 0 ? Math.round(totalAmount / qty) : Math.max(totalAmount, 0);

    await supabaseService.from("order_items").insert({
      order_id: orderId,
      product_name: productName,
      roast: roastLabel,
      grams: gram * qty,
      unit_price: unitPrice,
      subtotal: totalAmount,
    });

    if (beanRow) {
      const required = gram * qty;
      const currentStock = beanRow.stock_grams ?? 0;
      const nextStock = Math.max(0, currentStock - required);
      await supabaseService
        .from("bean_stocks")
        .update({
          stock_grams: nextStock,
          updated_at: new Date().toISOString(),
        })
        .eq("id", beanRow.id);
    }

    const notifyRecipient = process.env.GMAIL_SENDER || customerEmail;
    const subject = `注文通知: ${productName}`;
    const body = [
      `注文ID: ${session.id}`,
      `商品: ${productName}`,
      `グラム数: ${gram}g x ${qty}`,
      `焙煎度: ${roastLabel || "未設定"}`,
      `購入日時: ${new Date().toISOString()}`,
      `飲み頃: ${
        tasteStart && tasteEnd
          ? `${tasteStart.toISOString().slice(0, 10)} 〜 ${tasteEnd
              .toISOString()
              .slice(0, 10)}`
          : "未計算"
      }`,
      `賞味期限: ${expiryDate ? expiryDate.toISOString().slice(0, 10) : "未計算"}`,
      `Stripe 金額: ¥${totalAmount.toLocaleString()}`,
      `顧客メール: ${customerEmail}`,
    ].join("\n");

    await sendOrderNotification(notifyRecipient, subject, body);
  }

  return NextResponse.json({ received: true });
}
