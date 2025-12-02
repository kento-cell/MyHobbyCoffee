import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const unauthorized = NextResponse.json({ error: "Unauthorized" }, { status: 401 });

async function requireAdmin(request: Request) {
  if (!supabaseService) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace(/Bearer\s+/i, "").trim();
  if (!token) return unauthorized;
  const { data, error } = await supabaseService.auth.getUser(token);
  const role = data?.user?.app_metadata?.role;
  if (error || !data?.user || role !== "admin") return unauthorized;
  return null;
}

export async function GET(request: Request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

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
