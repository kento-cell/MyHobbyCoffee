import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type Body = {
  id?: string;
  beanName: string;
  deltaGram: number;
  lossRate?: number;
};

const unauthorized = NextResponse.json({ error: "Unauthorized" }, { status: 401 });

const adminEmailAllowlist = (
  process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || ""
)
  .split(",")
  .map((v) => v.trim().toLowerCase())
  .filter(Boolean);

const isAllowlisted = (email?: string | null) =>
  email ? adminEmailAllowlist.includes(email.toLowerCase()) : false;

async function requireAdmin(request: Request) {
  if (!supabaseService) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace(/Bearer\s+/i, "").trim();
  if (!token) return unauthorized;
  const { data, error } = await supabaseService.auth.getUser(token);
  const role = data?.user?.app_metadata?.role;
  const email = data?.user?.email;
  if (error || !data?.user || (role !== "admin" && !isAllowlisted(email))) return unauthorized;
  return null;
}

export async function POST(request: Request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

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
