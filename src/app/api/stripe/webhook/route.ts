import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseService } from "@/lib/supabase";
import { sendOrderNotification } from "@/lib/gmail";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const zeroDecimalCurrencies = new Set([
  "bif",
  "clp",
  "djf",
  "gnf",
  "jpy",
  "kmf",
  "krw",
  "mga",
  "pyg",
  "rwf",
  "ugx",
  "vnd",
  "vuv",
  "xaf",
  "xof",
  "xpf",
]);

const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const toCurrencyAmount = (
  amount: number | null | undefined,
  currency?: string | null
) => {
  const value = amount ?? 0;
  const code = currency?.toLowerCase();
  return code && zeroDecimalCurrencies.has(code) ? value : Math.round(value / 100);
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
    const currency = session.currency || "jpy";

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ["data.price.product"],
      limit: 100,
    });

    const normalizedItems = lineItems.data.map((item) => {
      const productData = (item.price?.product as Stripe.Product | null) ?? null;
      const meta = productData?.metadata || {};
      const productName =
        productData?.name ||
        item.description ||
        meta.productName ||
        "Unknown product";
      const gramValue = Number(meta.gram ?? meta.weight ?? 0);
      const gram = Number.isFinite(gramValue) ? gramValue : 0;
      const qty = item.quantity ?? 1;
      const roastId = meta.roastId || "";
      const roastLabel = meta.roastLabel || meta.roast || roastId || "";
      const subtotal = toCurrencyAmount(
        item.amount_total ?? item.amount_subtotal ?? 0,
        currency
      );
      const unitPrice = qty > 0 ? Math.round(subtotal / qty) : subtotal;

      return {
        productName,
        productId:
          (typeof productData?.id === "string" ? productData.id : "") ||
          (typeof meta.productId === "string" ? meta.productId : ""),
        gram,
        qty,
        roastId,
        roastLabel,
        subtotal,
        unitPrice,
      };
    });

    const totalAmount =
      normalizedItems.reduce((sum, item) => sum + item.subtotal, 0) ||
      toCurrencyAmount(session.amount_total ?? 0, currency);

    const customerEmail =
      session.customer_details?.email ||
      session.metadata?.customerEmail ||
      "unknown@example.com";

    let tasteStart: Date | null = null;
    let tasteEnd: Date | null = null;
    let expiryDate: Date | null = null;
    const primaryRoastId = normalizedItems.find((item) => item.roastId)?.roastId;
    if (primaryRoastId) {
      const { data: roastRow } = await supabaseService
        .from("roast_profiles")
        .select("*")
        .eq("id", primaryRoastId)
        .maybeSingle();

      if (roastRow) {
        const baseDate = new Date();
        tasteStart = addDays(baseDate, roastRow.taste_start_days);
        tasteEnd = addDays(baseDate, roastRow.taste_end_days);
        expiryDate = addDays(baseDate, roastRow.expiry_days);
      }
    }

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

    if (orderId && normalizedItems.length > 0) {
      const { error: itemsError } = await supabaseService.from("order_items").insert(
        normalizedItems.map((item) => ({
          order_id: orderId,
          product_name: item.productName,
          roast: item.roastLabel || item.roastId || "unknown",
          grams: (item.gram || 0) * (item.qty || 1),
          unit_price: item.unitPrice,
          subtotal: item.subtotal,
        }))
      );

      if (itemsError) {
        return NextResponse.json({ error: itemsError.message }, { status: 500 });
      }
    }

    for (const item of normalizedItems) {
      if (!item.productName) continue;
      const required = (item.gram || 0) * (item.qty || 1);
      if (required <= 0) continue;

      const { data: beanRow } = await supabaseService
        .from("bean_stocks")
        .select("id, stock_grams")
        .eq("bean_name", item.productName)
        .maybeSingle();

      if (beanRow) {
        const nextStock = Math.max(0, (beanRow.stock_grams ?? 0) - required);
        await supabaseService
          .from("bean_stocks")
          .update({
            stock_grams: nextStock,
            updated_at: new Date().toISOString(),
          })
          .eq("id", beanRow.id);
      }
    }

    const notifyRecipient = process.env.GMAIL_SENDER || customerEmail;
    const subjectBase = normalizedItems[0]?.productName || "注文";
    const subject =
      normalizedItems.length > 1
        ? `注文通知: ${subjectBase} 他${normalizedItems.length - 1}件`
        : `注文通知: ${subjectBase}`;

    const itemsDescription =
      normalizedItems
        .map(
          (item) =>
            `- ${item.productName} | ${item.gram}g x ${item.qty} | 焙煎: ${
              item.roastLabel || "未設定"
            } | 小計: ¥${item.subtotal.toLocaleString()}`
        )
        .join("\n") || "- 商品情報なし";

    const messageLines = [
      `注文ID: ${session.id}`,
      `合計: ¥${totalAmount.toLocaleString()}`,
      `顧客メール: ${customerEmail}`,
      `商品内訳:\n${itemsDescription}`,
    ];

    if (tasteStart && tasteEnd) {
      messageLines.push(
        `飲み頃: ${tasteStart.toISOString().slice(0, 10)} 〜 ${tasteEnd
          .toISOString()
          .slice(0, 10)}`
      );
    }

    if (expiryDate) {
      messageLines.push(`賞味期限: ${expiryDate.toISOString().slice(0, 10)}`);
    }

    await sendOrderNotification(notifyRecipient, subject, messageLines.join("\n"));
  }

  return NextResponse.json({ received: true });
}
