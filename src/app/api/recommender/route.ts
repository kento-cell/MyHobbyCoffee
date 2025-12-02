import { NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabase";
import { getMenuAll } from "@/lib/microcms";
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

// Fallback 18 beans (6 origins x 3 roast levels)
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

const fetchBeans = async (): Promise<{ beans: BeanRow[]; fallback: boolean }> => {
  let menuBeans: BeanRow[] = [];
  let fetchFailed = false;

  try {
    const { contents } = await getMenuAll();
    menuBeans =
      contents?.map((item) => ({
        id: item.id,
        name: item.name,
        roast: (Array.isArray(item.roast) ? item.roast[0] : item.roast) ?? null,
        acidity: typeof (item as any).acidity === "number" ? (item as any).acidity : null,
        bitterness: typeof (item as any).bitterness === "number" ? (item as any).bitterness : null,
        notes:
          (item as any).description ??
          (Array.isArray(item.weightOptions) ? item.weightOptions.join(", ") : undefined),
      })) ?? [];
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

const mapAnswerProfile = (answers: RecoAnswers) => {
  const acidityPref =
    answers.q2_acidity === "好き" ? 4 : answers.q2_acidity === "苦手" ? 1 : 2.5;
  const bitternessPref =
    answers.q3_bitterness === "深め・ビターが好き"
      ? 4
      : answers.q3_bitterness === "軽めが好き"
        ? 1.5
        : 2.5;

  let roastPref = 2;
  if (answers.q3_bitterness === "深め・ビターが好き") roastPref = 3;
  if (answers.q2_acidity === "好き" && answers.q3_bitterness === "軽めが好き") roastPref = 1;
  if (answers.q4_timing === "朝") roastPref = Math.max(1, roastPref - 0.3);
  if (answers.q4_timing === "夜") roastPref = Math.min(3, roastPref + 0.3);

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
  if (answers.q3_bitterness === "深め・ビターが好き") {
    parts.push("ビター好き");
  } else if (answers.q3_bitterness === "軽めが好き") {
    parts.push("軽め志向");
  }
  if (answers.q2_acidity === "好き") parts.push("酸味を好む");
  if (answers.q2_acidity === "苦手") parts.push("酸味控えめ");
  if (answers.q4_timing) parts.push(`${answers.q4_timing}に飲むことが多い`);
  if (answers.q8_value) parts.push(`求めるのは「${answers.q8_value}」`);
  return parts.join(" / ") || "回答傾向に基づき選定しました。";
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
    return NextResponse.json(
      { error: "8問すべてに回答してください。" },
      { status: 400 }
    );
  }

  const { beans, fallback } = await fetchBeans();
  const result = localRecommend(answers, beans, fallback);

  if (!result?.primary) {
    return NextResponse.json({ error: "レコメンドを生成できませんでした。" }, { status: 500 });
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
