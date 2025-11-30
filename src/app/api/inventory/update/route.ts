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

  const lossRate = typeof body.lossRate === "number" ? body.lossRate : undefined;

  const { data: existing, error: fetchError } = await supabaseService
    .from("beans_inventory")
    .select("*")
    .eq("bean_name", body.beanName)
    .limit(1)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const nextStock = (existing?.stock_gram || 0) + body.deltaGram;
  if (nextStock < 0) {
    return NextResponse.json({ error: "Stock cannot be negative" }, { status: 400 });
  }

  const payload = {
    id: existing?.id ?? body.id,
    bean_name: body.beanName,
    stock_gram: nextStock,
    loss_rate: lossRate ?? existing?.loss_rate ?? 0.12,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseService
    .from("beans_inventory")
    .upsert(payload)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
