import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type Body = {
  id?: string;
  beanName: string;
  deltaGram: number;
  lossRate?: number;
};

export async function POST(request: Request) {
  if (!supabaseService) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const body = (await request.json()) as Body;
  if (!body?.beanName || typeof body.deltaGram !== "number") {
    return NextResponse.json({ error: "beanName and deltaGram are required" }, { status: 400 });
  }

  const { data: existing, error: fetchError } = await supabaseService
    .from("bean_stocks")
    .select("id, bean_name, stock_grams")
    .eq("bean_name", body.beanName)
    .limit(1)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const baseStock = existing?.stock_grams ?? 0;
  const nextStock = baseStock + body.deltaGram;
  if (nextStock < 0) {
    return NextResponse.json({ error: "Stock cannot be negative" }, { status: 400 });
  }

  const payload = {
    id: existing?.id ?? body.id,
    bean_name: body.beanName,
    stock_grams: nextStock,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseService
    .from("bean_stocks")
    .upsert(payload)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
