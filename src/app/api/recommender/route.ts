import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase";
import { getMenuAll, type MenuItem } from "@/lib/microcms";
import {
  DEVICE_COOKIE_NAME,
  RecoAnswers,
  parseDeviceIdFromCookieHeader,
  requiredAnswerKeys,
} from "@/lib/recommender/questions";

export const dynamic = "force-dynamic";

type BeanRow = {
  id: string | number;
  name: string;
  roast?: string | null;
  acidity?: number | null;
  bitterness?: number | null;
  notes?: string | null;
};

type RecoResult = {
  primary?: { id?: string | number; name?: string; reason?: string };
  alternatives?: { id?: string | number; name?: string; reason?: string }[];
  fallback?: boolean;
};

const ensureDeviceId = (request: Request, bodyDeviceId?: string | null) => {
  const fromHeader = parseDeviceIdFromCookieHeader(request.headers.get("cookie"));
  if (bodyDeviceId) return bodyDeviceId;
  if (fromHeader) return fromHeader;
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `dev-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const numOrNull = (value: unknown) => (typeof value === "number" ? value : null);
const stringOrNull = (value: unknown) => (typeof value === "string" ? value : null);

const fallbackBeans: BeanRow[] = [
  { id: "fallback-brazil-light", name: "Brazil Santos Light", roast: "Light", acidity: 3, bitterness: 1, notes: "nutty, milk chocolate" },
  { id: "fallback-brazil-medium", name: "Brazil Santos Medium", roast: "Medium", acidity: 2, bitterness: 2, notes: "nutty, cocoa" },
  { id: "fallback-brazil-dark", name: "Brazil Santos Dark", roast: "Dark", acidity: 1, bitterness: 4, notes: "dark chocolate" },
  { id: "fallback-ethiopia-light", name: "Ethiopia Yirgacheffe Light", roast: "Light", acidity: 4, bitterness: 1, notes: "citrus, floral" },
  { id: "fallback-ethiopia-medium", name: "Ethiopia Yirgacheffe Medium", roast: "Medium", acidity: 3, bitterness: 2, notes: "citrus, tea-like" },
  { id: "fallback-ethiopia-dark", name: "Ethiopia Yirgacheffe Dark", roast: "Dark", acidity: 2, bitterness: 3, notes: "spice, cocoa" },
  { id: "fallback-rwanda-light", name: "Rwanda Natural Light", roast: "Light", acidity: 4, bitterness: 1, notes: "berry, floral" },
  { id: "fallback-rwanda-medium", name: "Rwanda Natural Medium", roast: "Medium", acidity: 3, bitterness: 2, notes: "berry, caramel" },
  { id: "fallback-rwanda-dark", name: "Rwanda Natural Dark", roast: "Dark", acidity: 2, bitterness: 3, notes: "dark fruit, cocoa" },
  { id: "fallback-colombia-light", name: "Colombia Supremo Light", roast: "Light", acidity: 3, bitterness: 1, notes: "red fruit, caramel" },
  { id: "fallback-colombia-medium", name: "Colombia Supremo Medium", roast: "Medium", acidity: 2.5, bitterness: 2, notes: "caramel, chocolate" },
  { id: "fallback-colombia-dark", name: "Colombia Supremo Dark", roast: "Dark", acidity: 1.5, bitterness: 3.5, notes: "bitter chocolate" },
  { id: "fallback-guatemala-light", name: "Guatemala Antigua Light", roast: "Light", acidity: 3.5, bitterness: 1.5, notes: "citrus, honey" },
  { id: "fallback-guatemala-medium", name: "Guatemala Antigua Medium", roast: "Medium", acidity: 2.5, bitterness: 2.5, notes: "chocolate, nutty" },
  { id: "fallback-guatemala-dark", name: "Guatemala Antigua Dark", roast: "Dark", acidity: 1.5, bitterness: 3.5, notes: "smoky, cocoa" },
  { id: "fallback-sumatra-light", name: "Sumatra Mandheling Light", roast: "Light", acidity: 2.5, bitterness: 2, notes: "herbal, spice" },
  { id: "fallback-sumatra-medium", name: "Sumatra Mandheling Medium", roast: "Medium", acidity: 2, bitterness: 3, notes: "earthy, spice" },
  { id: "fallback-sumatra-dark", name: "Sumatra Mandheling Dark", roast: "Dark", acidity: 1, bitterness: 4, notes: "earthy, dark cocoa" },
];

const normalizeMenuItem = (item: MenuItem): BeanRow => {
  const rawAcidity = (item as Record<string, unknown>).acidity;
  const rawBitterness = (item as Record<string, unknown>).bitterness;
  const rawDescription = (item as Record<string, unknown>).description;

  return {
    id: item.id,
    name: item.name,
    roast: (Array.isArray(item.roast) ? item.roast[0] : item.roast) ?? null,
    acidity: numOrNull(rawAcidity),
    bitterness: numOrNull(rawBitterness),
    notes:
      stringOrNull(rawDescription) ??
      (Array.isArray(item.weightOptions) ? item.weightOptions.join(", ") : undefined) ??
      item.description,
  };
};

const fetchBeans = async (): Promise<{ beans: BeanRow[]; fallback: boolean }> => {
  let menuBeans: BeanRow[] = [];
  let fetchFailed = false;

  try {
    const { contents } = await getMenuAll();
    menuBeans = contents?.map(normalizeMenuItem) ?? [];
  } catch {
    fetchFailed = true;
  }

  let stockMap: Record<string, number> = {};
  if (supabaseService) {
    const { data: stockRows } = await supabaseService
      .from("bean_stocks")
      .select("bean_name, stock_grams");
    stockMap =
      stockRows?.reduce<Record<string, number>>((acc, row) => {
        acc[row.bean_name] = row.stock_grams ?? 0;
        return acc;
      }, {}) ?? {};
  }

  const hasStockInfo = Object.keys(stockMap).length > 0;
  const filtered = hasStockInfo
    ? menuBeans.filter((row) => (stockMap[row.name] ?? 0) > 0)
    : menuBeans;

  if (filtered.length > 0) return { beans: filtered, fallback: false };
  if (menuBeans.length > 0) return { beans: menuBeans, fallback: true };
  return { beans: fallbackBeans, fallback: true || fetchFailed };
};

const roastLevel = (roast?: string | null) => {
  if (!roast) return 2;
  const lower = roast.toLowerCase();
  if (lower.includes("light") || lower.includes("浅")) return 1;
  if (lower.includes("dark") || lower.includes("深")) return 3;
  return 2;
};

const includesAny = (value: string | undefined, keywords: string[]) => {
  const lower = value?.toLowerCase() || "";
  return keywords.some((k) => lower.includes(k.toLowerCase()));
};

const mapAnswerProfile = (answers: RecoAnswers) => {
  const acidityPref = includesAny(answers.q2_acidity, ["高", "strong", "酸", "bright"])
    ? 4
    : includesAny(answers.q2_acidity, ["低", "まろ", "low"])
      ? 1
      : 2.5;

  const bitternessPref = includesAny(answers.q3_bitterness, ["強", "ビター", "deep"])
    ? 3.5
    : includesAny(answers.q3_bitterness, ["弱", "まろ", "light"])
      ? 1.5
      : 2.5;

  let roastPref = 2;
  if (includesAny(answers.q3_bitterness, ["強", "ビター", "deep"])) roastPref = 3;
  if (includesAny(answers.q2_acidity, ["浅", "爽", "light"])) roastPref = Math.max(1, roastPref - 0.3);
  if (includesAny(answers.q4_timing, ["朝", "morning"])) roastPref = Math.max(1, roastPref - 0.2);
  if (includesAny(answers.q4_timing, ["夜", "evening"])) roastPref = Math.min(3, roastPref + 0.2);

  return { acidityPref, bitternessPref, roastPref };
};

const scoreBean = (
  bean: BeanRow,
  profile: { acidityPref: number; bitternessPref: number; roastPref: number }
) => {
  const beanAcidity = typeof bean.acidity === "number" ? bean.acidity : 2.5;
  const beanBitterness = typeof bean.bitterness === "number" ? bean.bitterness : 2.5;
  const beanRoast = roastLevel(bean.roast);

  const acidityDiff = Math.abs(beanAcidity - profile.acidityPref);
  const bitternessDiff = Math.abs(beanBitterness - profile.bitternessPref);
  const roastDiff = Math.abs(beanRoast - profile.roastPref);

  return roastDiff * 2 + acidityDiff + bitternessDiff;
};

const buildReason = (answers: RecoAnswers) => {
  const parts: string[] = [];
  if (answers.q3_bitterness) {
    parts.push(`苦味の好み: ${answers.q3_bitterness}`);
  }
  if (answers.q2_acidity) {
    parts.push(`酸味の好み: ${answers.q2_acidity}`);
  }
  if (answers.q4_timing) {
    parts.push(`飲むタイミング: ${answers.q4_timing}`);
  }
  if (answers.q8_value) {
    parts.push(`重視する価値: ${answers.q8_value}`);
  }
  return parts.join(" / ") || "好みに合わせて選びました。";
};

const localRecommend = (answers: RecoAnswers, beans: BeanRow[], fallback: boolean): RecoResult => {
  const profile = mapAnswerProfile(answers);
  const scored = beans
    .map((bean) => ({
      bean,
      score: scoreBean(bean, profile),
    }))
    .sort((a, b) => a.score - b.score);

  const primary = scored[0]?.bean;
  const alternatives = scored.slice(1, 4).map((s) => s.bean);

  return {
    primary: primary
      ? {
          id: primary.id,
          name: primary.name,
          reason: buildReason(answers),
        }
      : undefined,
    alternatives: alternatives.map((bean) => ({
      id: bean.id,
      name: bean.name,
    })),
    fallback,
  };
};

const validateAnswers = (answers: RecoAnswers) => {
  if (!answers) return false;
  return requiredAnswerKeys.every((key) => typeof answers[key] === "string" && answers[key]);
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    deviceId?: string;
    answers?: RecoAnswers;
  };

  const deviceId = ensureDeviceId(request, body.deviceId);
  const answers = body.answers || {};

  if (!validateAnswers(answers)) {
    return NextResponse.json({ error: "8つの質問にすべて回答してください。" }, { status: 400 });
  }

  const { beans, fallback } = await fetchBeans();
  const result = localRecommend(answers, beans, fallback);

  if (!result?.primary) {
    return NextResponse.json({ error: "おすすめを生成できませんでした。" }, { status: 500 });
  }

  let insertedId: string | null = null;
  if (supabaseService) {
    const payload = {
      device_id: deviceId,
      answers,
      result_bean: result.primary?.id ?? null,
      result_json: result,
    };
    const { data, error: insertError } = await supabaseService
      .from("user_answers")
      .insert(payload as Record<string, unknown>)
      .select("id")
      .maybeSingle();
    if (!insertError) {
      insertedId = data?.id as string | null;
    }
  }

  const response = NextResponse.json({
    id: insertedId || undefined,
    deviceId,
    primary: result.primary,
    alternatives: result.alternatives || [],
    fallback,
  });

  response.cookies.set({
    name: DEVICE_COOKIE_NAME,
    value: deviceId,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}
