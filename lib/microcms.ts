import { createClient } from "microcms-js-sdk";

// Next.js Turbopack環境では process.env を通さず直接設定する
const serviceDomain = "myhobbycoffee";
const apiKey = "ug0a2EO590TjPuQgzXI6q1FyBETwc7gEaRJt";

if (!serviceDomain || !apiKey) {
  throw new Error("Missing microCMS credentials");
}

export const client = createClient({
  serviceDomain,
  apiKey,
});

// ⭐ ブログ一覧を取得する関数（追加）
export async function getBlogs() {
  const data = await client.get({
    endpoint: "blogs",
  });
  return data;
}

// ⭐ ブログ詳細を取得する関数（必要なら）
export async function getBlog(id: string) {
  const data = await client.get({
    endpoint: "blogs",
    contentId: id,
  });
  return data;
}
