import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "あなたのための豆診断 | Aurelbel Roastery",
  description: "8つの質問に答えるだけで、あなたにぴったりのコーヒー豆をAIが診断します。",
};

export default function RecommenderStartPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <section className="relative overflow-hidden rounded-3xl border border-[#e7f2cd] bg-gradient-to-br from-[#f7fbf1] via-white to-[#eef6e0] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] md:p-12">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#a4de02]/20 blur-3xl" />
        <div className="absolute -bottom-10 -left-12 h-40 w-40 rounded-full bg-[#1f3b08]/10 blur-3xl" />
        <div className="relative space-y-6">
          <p className="text-xs uppercase tracking-[0.24em] text-gray-600">
            AI Coffee Match
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-[#1c1c1c] md:text-4xl">
            あなたのための豆を選びます
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-gray-700">
            8つの質問に答えるだけで、性格・嗜好・生活リズムから最適な1杯をAIが診断します。
            在庫のあるAurelbel Roasteryの豆から、ぴったりのものを1種とサブ候補3種をご提案します。
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
            <span className="rounded-full bg-white/80 px-4 py-2 shadow-sm">回答時間 ≒ 1分</span>
            <span className="rounded-full bg-white/80 px-4 py-2 shadow-sm">8問で完了</span>
            <span className="rounded-full bg-white/80 px-4 py-2 shadow-sm">在庫データと連動</span>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/recommender/questions"
              className="rounded-full bg-[#a4de02] px-6 py-3 text-sm font-semibold text-[#0f1c0a] shadow-[0_16px_46px_rgba(164,222,2,0.55)] transition hover:-translate-y-[1px] hover:shadow-[0_20px_56px_rgba(164,222,2,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f3b08]"
            >
              AI診断スタート
            </Link>
            <Link
              href="/menu"
              className="rounded-full border border-[#1f3b08] px-6 py-3 text-sm font-semibold text-[#1f3b08] transition hover:-translate-y-[1px] hover:bg-[#1f3b08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a4de02] focus-visible:ring-offset-2"
            >
              まずはメニューを見る
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
