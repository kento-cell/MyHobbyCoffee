import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getMenu } from "@/lib/microcms";
import { supabaseService } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type Body = {
  productId: string;
  qty: number;
  roastId?: string;
  gram: number;
};

const clampGram = (gram: number, minBase = 100) => {
  const safe = Math.max(minBase, Math.min(1000, gram));
  return Math.round(safe / 100) * 100;
};

export async function POST(request: Request) {
  if (!supabaseService) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const body = (await request.json()) as Body;
  if (!body?.productId || !body.qty || !body.gram) {
    return NextResponse.json({ error: "productId, qty, gram are required" }, { status: 400 });
  }

  const qty = Math.max(1, Math.min(10, Math.floor(body.qty)));

  const product = await getMenu(body.productId);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const baseAmount =
    typeof product.amount === "number"
      ? product.amount
      : Number(product.amount) || 100;

  const gram = clampGram(body.gram, baseAmount);
  const price =
    typeof product.price === "number"
      ? product.price
      : Number(product.price) || 0;
  const unitAmount = Math.max(0, Math.round((price / baseAmount) * gram));

  const { data: beanRow, error: invError } = await supabaseService
    .from("beans_inventory")
    .select("*")
    .eq("bean_name", product.name)
    .limit(1)
    .maybeSingle();

  if (invError) {
    return NextResponse.json({ error: invError.message }, { status: 500 });
  }

  if (!beanRow) {
    return NextResponse.json({ error: "Inventory not found for this bean" }, { status: 400 });
  }

  const lossRate = beanRow.loss_rate ?? 0.12;
  const requiredGram = Math.ceil(gram * qty * (1 + lossRate));

  if (beanRow.stock_gram < requiredGram) {
    return NextResponse.json(
      {
        error: `在庫不足です。必要量: ${requiredGram}g / 在庫: ${beanRow.stock_gram}g`,
      },
      { status: 400 }
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/menu/${product.id}`,
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: qty,
        price_data: {
          currency: "jpy",
          unit_amount: unitAmount,
          product_data: {
            name: product.name,
            images: product.image?.url ? [product.image.url] : undefined,
            metadata: {
              productId: product.id,
            },
          },
        },
      },
    ],
    metadata: {
      productId: product.id,
      productName: product.name,
      qty: String(qty),
      gram: String(gram),
      roastId: body.roastId || "",
    },
  });

  return NextResponse.json({ url: session.url });
}
