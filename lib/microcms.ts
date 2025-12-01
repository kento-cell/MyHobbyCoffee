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
  price?: number | string;
  amount?: number | string;
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

export type TopBackground = {
  id?: string;
  Topbk?: ImageField;
  Topbk2?: ImageField[];
  topbk?: ImageField;
  topbk2?: ImageField[];
};

export type NormalizedTopBackground = {
  primary?: ImageField;
  gallery: ImageField[];
};

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;
const topBackgroundEndpoint =
  process.env.MICROCMS_TOP_BACKGROUND_ENDPOINT || "topbk";

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

const normalizeTopBackground = (
  data: TopBackground | null
): NormalizedTopBackground | null => {
  if (!data) return null;
  const primary = data.Topbk ?? data.topbk;
  const gallery = data.Topbk2 ?? data.topbk2 ?? [];
  const filtered = gallery.filter(
    (img): img is ImageField => Boolean(img && img.url)
  );
  return {
    primary: primary?.url ? primary : undefined,
    gallery: filtered,
  };
};

export const getTopBackground = async (): Promise<
  NormalizedTopBackground | null
> => {
  const c = getClient();
  if (!c) {
    return null;
  }

  try {
    const res = await c.get<TopBackground>({
      endpoint: topBackgroundEndpoint,
    });
    return normalizeTopBackground(res);
  } catch {
    try {
      const list = await c.getList<TopBackground>({
        endpoint: topBackgroundEndpoint,
        queries: { limit: 1 },
      });
      return normalizeTopBackground(list.contents[0] ?? null);
    } catch (err) {
      console.warn(
        `Failed to fetch top backgrounds from ${topBackgroundEndpoint}`,
        err
      );
      return null;
    }
  }
};

export const getImageUrl = (url?: string) => {
  return url ? url : "/no_image.jpg";
};
