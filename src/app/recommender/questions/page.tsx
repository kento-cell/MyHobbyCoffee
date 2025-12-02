'use client';

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DEVICE_COOKIE_NAME,
  RecoAnswers,
  RecoAnswerKey,
  recoQuestions,
  requiredAnswerKeys,
} from "@/lib/recommender/questions";

const generateDeviceId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `dev-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const readCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split(";")
    .map((v) => v.trim())
    .find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1] || "") : null;
};

const ensureDeviceCookie = () => {
  if (typeof document === "undefined") return null;
  const existing = readCookie(DEVICE_COOKIE_NAME);
  if (existing) return existing;
  const nextId = generateDeviceId();
  document.cookie = `${DEVICE_COOKIE_NAME}=${encodeURIComponent(
    nextId
  )}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  return nextId;
};

export default function RecommenderQuestionsPage() {
  const router = useRouter();
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<RecoAnswers>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = ensureDeviceCookie();
    if (id) setDeviceId(id);
  }, []);

  const allAnswered = useMemo(
    () => requiredAnswerKeys.every((key) => Boolean(answers[key])),
    [answers]
  );

  const handleChange = (key: RecoAnswerKey, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!allAnswered) {
      setError("すべての質問に回答してください。");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/recommender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId, answers }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error || "診断に失敗しました。時間をおいて再度お試しください。");
        return;
      }
      if (typeof window !== "undefined") {
        try {
          window.sessionStorage.setItem(
            "reco:last-result",
            JSON.stringify({ primary: json?.primary, alternatives: json?.alternatives })
          );
        } catch {
          // ignore storage errors
        }
      }
      const resultId = json?.id || "";
      router.push(resultId ? `/recommender/result?id=${resultId}` : "/recommender/result");
    } catch (err) {
      setError("通信に失敗しました。ネットワークを確認してください。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-6 pb-16 pt-10">
      <header className="mb-8 space-y-3">
        <p className="text-xs uppercase tracking-[0.22em] text-gray-600">AI Coffee Match</p>
        <h1 className="text-3xl font-semibold text-[#1c1c1c] md:text-4xl">あなたのテイスト診断</h1>
        <p className="text-sm leading-relaxed text-gray-700 md:text-base">
          8つの質問に答えるだけで、あなたに最適な豆をAIがピックアップします。すべて選択式で1分ほどです。
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {recoQuestions.map((q, idx) => (
          <div
            key={q.id}
            className="rounded-2xl border border-[#e8e8e8] bg-white p-5 shadow-[0_12px_30px_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Q{idx + 1}</p>
                <h3 className="text-lg font-semibold text-[#1c1c1c]">{q.title}</h3>
              </div>
              <span className="text-xs font-semibold text-[#1f3b08]">
                {answers[q.id] ? "選択済み" : "未選択"}
              </span>
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-3">
              {q.options.map((option) => {
                const selected = answers[q.id] === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleChange(q.id, option)}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                      selected
                        ? "border-[#a4de02] bg-[#f7fbf1] text-[#1f3b08] shadow-sm"
                        : "border-[#e5e5e5] bg-white text-[#1c1c1c] hover:border-[#cfd8b5]"
                    }`}
                  >
                    <span>{option}</span>
                    <span
                      className={`h-4 w-4 rounded-full border ${
                        selected ? "border-[#1f3b08] bg-[#a4de02]" : "border-[#d4d4d4]"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={submitting || !allAnswered}
            className="rounded-full bg-[#a4de02] px-6 py-3 text-sm font-semibold text-[#0f1c0a] shadow-[0_16px_46px_rgba(164,222,2,0.55)] transition hover:-translate-y-[1px] hover:shadow-[0_20px_56px_rgba(164,222,2,0.65)] disabled:opacity-60"
          >
            {submitting ? "診断中…" : "診断して結果を見る"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/recommender/start")}
            className="text-sm font-semibold text-[#1f3b08] underline-offset-4 hover:underline"
          >
            スタートに戻る
          </button>
        </div>
      </form>
    </main>
  );
}
