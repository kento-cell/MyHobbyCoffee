/* ================================
   APIの置き場
================================ */

import { createClient } from "microcms-js-sdk";

const serviceDomain = "myhobbycoffee";
const apiKey = "ug0a2EO590TjPuQgzXI6q1FyBETwc7gEaRJt";

// microCMSクライアント
export const client = createClient({
  serviceDomain,
  apiKey,
});

/* ================================
   ブログ用 API
================================ */
export async function getBlogs() {
  return await client.get({
    endpoint: "blogs",
    queries: {
      fields: "id,title,eyecatch",
    },
  });
}

export async function getBlog(id: string) {
  return await client.get({
    endpoint: "blogs",
    contentId: id,
    queries: {
      fields: "id,title,content,eyecatch,category",
    },
  });
}

/* ================================
   メニュー（コーヒー豆）一覧
================================ */
export async function getMenuAll() {
  return await client.getList({
    endpoint: "menu",
    queries: {
      limit: 100,
      orders: "-publishedAt",
    },
  });
}

/* ================================
  おすすめの豆（isRecommended=true）
================================ */
export async function getRecommendedMenu() {
  return await client.getList({
    endpoint: "menu",
    queries: {
      filters: "isRecommended[equals]true",
      limit: 3,
      orders: "-publishedAt",
    },
  });
}

/* ================================
  画像URL（fallback付き）
================================ */
export const getImageUrl = (url?: string) => {
  return url ? url : "/no_image.jpg"; // ← これが正解
};
