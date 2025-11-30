import { NextResponse } from "next/server";
import { getMenuAll } from "@/lib/microcms";

export const dynamic = "force-dynamic";

export async function GET() {
  const { contents } = await getMenuAll();
  const data = contents.map((item) => ({
    id: item.id,
    name: item.name,
  }));
  return NextResponse.json({ data });
}
