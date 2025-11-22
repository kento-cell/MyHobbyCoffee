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
  body?: string;
  date?: string;
  eyecatch?: ImageField;
  category?: {
    id?: string;
    name?: string;
  };
};

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;

const client =
  serviceDomain && apiKey
    ? createClient({
        serviceDomain,
        apiKey,
      })
    : null;

const getClient = () => {
  if (!client) {
    console.warn(
      "MICROCMS_SERVICE_DOMAIN or MICROCMS_API_KEY is not set. Returning fallback data."
    );
    return null;
  }
  return client;
};

export const getBlogs = async () => {
  const c = getClient();
  if (!c) {
    return { contents: [], totalCount: 0, limit: 0, offset: 0 };
  }
  return await c.getList<BlogEntry>({
    endpoint: "blogs",
    queries: {
      limit: 100,
      orders: "-publishedAt",
    },
  });
};

export const getBlog = async (id: string) => {
  const c = getClient();
  if (!c) {
    return null;
  }
  return await c.get<BlogEntry>({
    endpoint: "blogs",
    contentId: id,
  });
};

export const getMenuAll = async () => {
  const c = getClient();
  if (!c) {
    return { contents: [], totalCount: 0, limit: 0, offset: 0 };
  }
  return await c.getList<MenuItem>({
    endpoint: "menu",
    queries: {
      limit: 100,
      orders: "-publishedAt",
    },
  });
};

export const getMenu = async (id: string) => {
  const c = getClient();
  if (!c) {
    return null;
  }
  return await c.get<MenuItem>({
    endpoint: "menu",
    contentId: id,
  });
};

export const getRecommendedMenu = async () => {
  const c = getClient();
  if (!c) {
    return { contents: [], totalCount: 0, limit: 0, offset: 0 };
  }
  return await c.getList<MenuItem>({
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
