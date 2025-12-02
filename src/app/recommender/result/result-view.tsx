'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type RecoCard = { id?: string | number; name?: string; reason?: string };

type RecoResult = {
  primary?: RecoCard;
  alternatives?: RecoCard[];
  fallback?: boolean;
};

export function ResultView({ initialResult }: { initialResult: RecoResult | null }) {
  const router = useRouter();
  const [result, setResult] = useState<RecoResult | null>(initialResult);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    try {
      if (initialResult?.primary) {
        window.sessionStorage.setItem("reco:last-result", JSON.stringify(initialResult));
        return;
      }
      const cached = window.sessionStorage.getItem("reco:last-result");
      if (cached) {
        setResult(JSON.parse(cached) as RecoResult);
      }
    } catch {
      // ignore storage errors
    }
  }, [initialResult]);

  const deck = useMemo(() => {
    if (!result) return [];
    const list: RecoCard[] = [];
    if (result.primary) list.push(result.primary);
    if (result.alternatives?.length) {
      list.push(...result.alternatives);
    }
    return list.filter((item) => item && item.name);
  }, [result]);

  useEffect(() => {
    setIndex(0);
  }, [deck.length]);

  const current = deck[index];
  const fallback = result?.fallback;

  if (!current) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-gray-500">AI Coffee Match</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#1c1c1c]">診断結果がありません</h1>
        <p className="mt-3 text-sm text-gray-700">
          最新の診断結果が見つかりませんでした。もう一度診断をお試しください。
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            href="/recommender/questions"
            className="rounded-full bg-[#a4de02] px-6 py-3 text-sm font-semibold text-[#0f1c0a] shadow-[0_16px_46px_rgba(164,222,2,0.55)] transition hover:-translate-y-[1px]"
          >
            診断をはじめる
          </Link>
        </div>
      </main>
    );
  }

  const goNext = () => setIndex((prev) => Math.min(prev + 1, deck.length));

  const handleLike = () => {
    if (current?.id) {
      router.push(`/menu/${current.id}`);
    } else {
      router.push("/menu");
    }
  };

  const handleSkip = () => {
    goNext();
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-gray-600">AI Coffee Match</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#1c1c1c]">
            {fallback ? "入荷待ちですが、あなたへのおすすめ" : "今の在庫から選んだおすすめ"}
          </h1>
          <p className="text-sm text-gray-700">
            {fallback
              ? "現在在庫が0件のため、入荷待ちとして最適な豆を提案しています。入荷後にぜひお試しください。"
              : "在庫ありの豆だけから最適解を提示しています。"}
          </p>
        </div>
        <span className="text-xs font-semibold text-gray-500">
          {Math.min(index + 1, deck.length)} / {deck.length}
        </span>
      </div>

      <section className="relative min-h-[360px] rounded-3xl border border-[#e8e8e8] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#a4de02]/15 blur-3xl" />
        <div className="absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-[#1f3b08]/10 blur-3xl" />
        <div className="relative space-y-4">
          <p className="text-sm font-semibold text-[#1f3b08]">
            🎉 {fallback ? "入荷待ち・あなたに合う一杯候補" : "在庫あり・いまのイチ押し"}
          </p>
          <h2 className="text-3xl font-semibold text-[#1c1c1c]">{current.name}</h2>
          {current.reason && (
            <p className="text-sm leading-relaxed text-gray-700">理由：{current.reason}</p>
          )}
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 sm:max-w-md">
            <span className="rounded-full bg-[#f7fbf1] px-3 py-2 text-[#1f3b08]">
              {fallback ? "入荷待ち" : "在庫あり"}
            </span>
            <span className="rounded-full bg-[#eef2f7] px-3 py-2 text-[#1f2b3b]">
              今の気分にマッチ
            </span>
          </div>
        </div>

        <div className="relative mt-10 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleSkip}
            className="hidden rounded-full border border-[#e0e0e0] px-6 py-3 text-sm font-semibold text-[#1c1c1c] transition hover:-translate-y-[1px] hover:bg-[#f7f7f7] sm:inline-flex"
          >
            また今度！
          </button>

          <div className="flex flex-1 items-center justify-center">
            <div className="flex min-w-[240px] max-w-sm items-center justify-between rounded-2xl border border-[#f0f0f0] bg-[#f9fbf4] px-5 py-4 shadow-[0_14px_44px_rgba(0,0,0,0.05)]">
              <button
                type="button"
                onClick={handleSkip}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#e0e0e0] text-[11px] font-semibold text-[#1c1c1c] transition hover:-translate-y-[1px] hover:bg-[#f5f5f5] sm:hidden"
              >
                また今度
              </button>
              <button
                type="button"
                onClick={handleLike}
                className="flex h-14 flex-1 items-center justify-center rounded-full bg-[#a4de02] px-4 text-sm font-semibold text-[#0f1c0a] shadow-[0_16px_46px_rgba(164,222,2,0.55)] transition hover:-translate-y-[1px] hover:shadow-[0_20px_56px_rgba(164,222,2,0.65)]"
              >
                {fallback ? "詳細を見る" : "購入する"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSkip}
          className="rounded-full border border-[#e0e0e0] px-5 py-3 text-sm font-semibold text-[#1c1c1c] transition hover:-translate-y-[1px] hover:bg-[#f5f5f5]"
        >
          次の候補を見る
        </button>
        <Link
          href="/recommender/questions"
          className="rounded-full bg-[#1f3b08] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-[1px] hover:shadow-md"
        >
          もう一度診断する
        </Link>
        <Link
          href="/menu"
          className="text-sm font-semibold text-[#1f3b08] underline-offset-4 hover:underline"
        >
          メニューへ戻る
        </Link>
      </div>
    </main>
  );
}
