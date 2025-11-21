import { createClient } from "microcms-js-sdk";

type ImageField = {
  url: string;
  height?: number;
  width?: number;
};

export type MenuItem = {
  id: string;
  name: string;
  image?: ImageField;
  roast?: string | string[];
  origin?: string;
  process?: string;
  description?: string;
  price?: number;
  isRecommended?: boolean;
  weightOptions?: string[];
};

export type BlogEntry = {
  id: string;
  title: string;
  content?: string;
  date?: string;
  eyecatch?: ImageField;
  category?: {
    id?: string;
    name?: string;
  };
};

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;

if (!serviceDomain || !apiKey) {
  throw new Error("MICROCMS_SERVICE_DOMAIN or MICROCMS_API_KEY is not set");
}

export const client = createClient({
  serviceDomain,
  apiKey,
});

export const getBlogs = async () => {
  return await client.getList<BlogEntry>({
    endpoint: "blogs",
    queries: {
      fields: "id,title,date,eyecatch,category",
      orders: "-publishedAt",
    },
  });
};

export const getBlog = async (id: string) => {
  return await client.get<BlogEntry>({
    endpoint: "blogs",
    contentId: id,
    queries: {
      fields: "id,title,content,date,eyecatch,category",
    },
  });
};

export const getMenuAll = async () => {
  return await client.getList<MenuItem>({
    endpoint: "menu",
    queries: {
      limit: 100,
      orders: "-publishedAt",
    },
  });
};

export const getMenu = async (id: string) => {
  return await client.get<MenuItem>({
    endpoint: "menu",
    contentId: id,
  });
};

export const getRecommendedMenu = async () => {
  return await client.getList<MenuItem>({
    endpoint: "menu",
    queries: {
      filters: "isRecommended[equals]true",
      limit: 3,
      orders: "-publishedAt",
    },
  });
};

export const getImageUrl = (url?: string) => {
  return url ? url : "/no_image.jpg";
};
