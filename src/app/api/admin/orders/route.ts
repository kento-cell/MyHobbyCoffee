import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase";

export const dynamic = "force-dynamic";

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

export async function GET(request: Request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  if (!supabaseService) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const { data, error } = await supabaseService
    .from("orders")
    .select(
      "id, email, total_amount, status, roasted_at, created_at, order_items (product_name, roast, grams, unit_price, subtotal)"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function PATCH(request: Request) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  if (!supabaseService) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    id?: string;
    status?: string;
    roasted_at?: string | null;
  };

  if (!body.id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const payload: Record<string, unknown> = {};
  if (body.status) payload.status = body.status;
  if (body.roasted_at !== undefined) payload.roasted_at = body.roasted_at;

  const { data, error } = await supabaseService
    .from("orders")
    .update(payload)
    .eq("id", body.id)
    .select("id, status, roasted_at")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
