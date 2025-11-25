import { NextResponse } from "next/server";
import { getMenu } from "@/lib/microcms";

export async function GET(
  _req: Request,
  { params }: { params: { id?: string } }
) {
  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const data = await getMenu(id);
    if (!data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
