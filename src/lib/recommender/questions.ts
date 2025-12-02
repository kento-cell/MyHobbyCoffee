export const DEVICE_COOKIE_NAME = "aurelbel_device_id";

export type RecoAnswerKey =
  | "q1_mood"
  | "q2_acidity"
  | "q3_bitterness"
  | "q4_timing"
  | "q5_snack"
  | "q6_holiday"
  | "q7_self"
  | "q8_value";

export type RecoAnswers = Partial<Record<RecoAnswerKey, string>>;
export const requiredAnswerKeys: RecoAnswerKey[] = [
  "q1_mood",
  "q2_acidity",
  "q3_bitterness",
  "q4_timing",
  "q5_snack",
  "q6_holiday",
  "q7_self",
  "q8_value",
];

export const recoQuestions: {
  id: RecoAnswerKey;
  title: string;
  subtitle?: string;
  options: string[];
}[] = [
  {
    id: "q1_mood",
    title: "1日のテンションはどちらに近い？",
    options: ["落ち着いた感じ", "普通", "活動的でエネルギッシュ"],
  },
  {
    id: "q2_acidity",
    title: "コーヒーの酸味はどう思う？",
    options: ["好き", "普通", "苦手"],
  },
  {
    id: "q3_bitterness",
    title: "苦味への耐性は？",
    options: ["軽めが好き", "ほどほど", "深め・ビターが好き"],
  },
  {
    id: "q4_timing",
    title: "コーヒーを飲むタイミングはいつが多い？",
    options: ["朝", "昼", "夜"],
  },
  {
    id: "q5_snack",
    title: "普段よく食べるお菓子は？",
    options: ["甘い系（チョコ・ケーキ）", "塩気のあるもの（ポテチ etc）", "食べない or バラバラ"],
  },
  {
    id: "q6_holiday",
    title: "好きな休日の過ごし方は？",
    options: ["ゆったり静かに", "買い物など適度に外出", "外に出て活動する"],
  },
  {
    id: "q7_self",
    title: "自分を一言で表すなら？",
    options: ["落ち着き", "バランス型", "自由・行動タイプ"],
  },
  {
    id: "q8_value",
    title: "コーヒーに求めるものを1つ選ぶと？",
    options: ["香り", "味のバランス", "刺激・インパクト"],
  },
];

export const parseDeviceIdFromCookieHeader = (cookieHeader?: string | null) => {
  if (!cookieHeader) return null;
  return cookieHeader
    .split(";")
    .map((v) => v.trim())
    .map((pair) => pair.split("="))
    .reduce<string | null>((acc, [key, value]) => {
      if (acc) return acc;
      if (decodeURIComponent(key) === DEVICE_COOKIE_NAME && value) {
        return decodeURIComponent(value);
      }
      return null;
    }, null);
};
