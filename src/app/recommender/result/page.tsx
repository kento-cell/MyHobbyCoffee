import { cookies } from "next/headers";
import { supabaseService } from "@/lib/supabase";
import { DEVICE_COOKIE_NAME } from "@/lib/recommender/questions";
import { ResultView } from "./result-view";

type RecoResult = {
  primary?: { id?: string | number; name?: string; reason?: string };
  alternatives?: { id?: string | number; name?: string; reason?: string }[];
  fallback?: boolean;
};

const loadResult = async (id?: string, deviceId?: string) => {
  if (!supabaseService) return null;

  let query = supabaseService
    .from("user_answers")
    .select("id, result_json, created_at")
    .order("created_at", { ascending: false })
    .limit(1);

  if (id) {
    query = query.eq("id", id).limit(1);
  } else if (deviceId) {
    query = query.eq("device_id", deviceId);
  }

  const { data, error } = await query.maybeSingle();
  if (error || !data?.result_json) return null;

  try {
    const parsed =
      typeof data.result_json === "string"
        ? (JSON.parse(data.result_json) as RecoResult)
        : (data.result_json as RecoResult);
    return { id: data.id as string | undefined, result: parsed };
  } catch {
    return null;
  }
};

export default async function RecommenderResultPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const cookieStore = await cookies();
  const deviceId = cookieStore.get(DEVICE_COOKIE_NAME)?.value;
  const record = await loadResult(searchParams.id, deviceId);

  return <ResultView initialResult={record?.result || null} />;
}
