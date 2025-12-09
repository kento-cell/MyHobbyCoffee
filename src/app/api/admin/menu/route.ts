import { NextResponse } from "next/server";
import { getMenuAll } from "@/lib/microcms";
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

  const { contents } = await getMenuAll();
  const data = contents.map((item) => ({
    id: item.id,
    name: item.name,
  }));
  return NextResponse.json({ data });
}
