import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getMenu } from "@/lib/microcms";
import { supabaseService } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type CheckoutItemInput = {
  productId: string;
  qty: number;
  roastId?: string;
  gram: number;
};

type MenuData = NonNullable<Awaited<ReturnType<typeof getMenu>>>;

type NormalizedItem = {
  product: MenuData;
  qty: number;
  gram: number;
  unitAmount: number;
  roastId: string;
  baseGram: number;
};

type Shortage = {
  productId: string;
  productName: string;
  required: number;
  available: number;
};

const clampQty = (qty: number) => Math.max(1, Math.min(10, Math.floor(qty || 0)));

const clampGram = (gram: number, minBase = 100) => {
  const safe = Math.max(minBase, Math.min(1000, gram));
  return Math.round(safe / 100) * 100;
};

const normalizeItems = async (
  items: CheckoutItemInput[]
): Promise<{
  items: NormalizedItem[];
  shortages?: Shortage[];
  error?: string;
  status?: number;
}> => {
  if (!supabaseService) {
    return { items: [], error: "Supabase not configured", status: 500 };
  }

  const normalized: NormalizedItem[] = [];
  const shortages: Shortage[] = [];

  for (const raw of items) {
    if (!raw?.productId || !raw.gram) {
      return { items: [], error: "productId and gram are required", status: 400 };
    }

    const qty = clampQty(raw.qty);
    const product = await getMenu(raw.productId);
    if (!product) {
      return { items: [], error: "Product not found", status: 404 };
    }

    const baseAmount =
      typeof product.amount === "number"
        ? product.amount
        : Number(product.amount) || 100;

    const gram = clampGram(raw.gram, baseAmount);
    const price =
      typeof product.price === "number"
        ? product.price
        : Number(product.price) || 0;
    const unitAmount = Math.max(0, Math.round((price / baseAmount) * gram));

    const { data: beanRow, error: invError } = await supabaseService
      .from("bean_stocks")
      .select("id, bean_name, stock_grams")
      .eq("bean_name", product.name)
      .limit(1)
      .maybeSingle();

    if (invError) {
      return { items: [], error: invError.message, status: 500 };
    }

    if (!beanRow) {
      return {
        items: [],
        error: "Inventory not found for this bean",
        status: 400,
      };
    }

    const stock = beanRow.stock_grams ?? 0;
    const requiredGram = gram * qty;

    if (stock < requiredGram) {
      shortages.push({
        productId: product.id,
        productName: product.name,
        required: requiredGram,
        available: stock,
      });
    } else {
      normalized.push({
        product,
        qty,
        gram,
        unitAmount,
        roastId: raw.roastId || "",
        baseGram: baseAmount,
      });
    }
  }

  if (shortages.length > 0) {
    return {
      items: [],
      shortages,
      error: "在庫不足の商品があります",
      status: 400,
    };
  }

  return { items: normalized };
};

export async function POST(request: Request) {
  if (!supabaseService) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const body = (await request.json().catch(() => null)) as
    | { items?: CheckoutItemInput[] }
    | CheckoutItemInput
    | null;

  const incomingItems = Array.isArray(body?.items)
    ? body?.items
    : body && "productId" in body
      ? [body as CheckoutItemInput]
      : [];

  if (!incomingItems.length) {
    return NextResponse.json({ error: "items are required" }, { status: 400 });
  }

  const { items, error, status, shortages } = await normalizeItems(incomingItems);
  if (error) {
    return NextResponse.json({ error, shortages }, { status: status ?? 400 });
  }

  const successUrl = `${
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  }/success`;
  const cancelUrl = `${
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  }/cart`;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    payment_method_types: ["card"],
    line_items: items.map((item) => ({
      quantity: item.qty,
      price_data: {
        currency: "jpy",
        unit_amount: item.unitAmount,
        product_data: {
          name: item.product?.name || "Unknown product",
          images: item.product?.image?.url
            ? [item.product.image.url]
            : undefined,
          metadata: {
            productId: item.product?.id || "",
            gram: String(item.gram),
            roastId: item.roastId || "",
            roastLabel: item.roastId || "",
            baseGram: String(item.baseGram),
          },
        },
      },
    })),
    metadata: {
      itemCount: String(items.length),
      productIds: items.map((i) => i.product?.id).filter(Boolean).join(","),
    },
  });

  return NextResponse.json({ url: session.url });
}
