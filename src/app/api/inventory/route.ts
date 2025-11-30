import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!supabaseService) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const { data, error } = await supabaseService
    .from("bean_stocks")
    .select("id, bean_name, stock_grams, updated_at")
    .order("bean_name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const normalized =
    data?.map((row) => ({
      ...row,
      current_stock_g: row.stock_grams ?? 0,
    })) ?? [];

  return NextResponse.json({ data: normalized });
}
