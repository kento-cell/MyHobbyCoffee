import Image from "next/image";
import Link from "next/link";
import { BlogCard, ProductCard } from "./_components/cards";
import { getBlogs, getRecommendedMenu } from "@/lib/microcms";

const heroMessages = [
  "焙煎の香りと産地の物語を、静かな余白とともに届けます。",
  "ライムグリーンのアクセントで、朝の一杯を軽やかに。",
  "軽い焙煎のニュアンスを、映像と写真で丁寧に伝える EC サイト。",
];

export default async function HomePage() {
  const [{ contents: recommended }, { contents: blogs }] = await Promise.all([
    getRecommendedMenu(),
    getBlogs(),
  ]);
  const heroCopy = heroMessages[0];
  const latestBlogs = blogs.slice(0, 2);

  return (
    <main className="pb-24">
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#f7fbf1] via-white to-[#eef6e0]">
        <video
          src="/SampleMov_home.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-24 md:flex-row md:items-center md:py-28">
          <div className="flex-1 space-y-6">
            <p className="text-sm uppercase tracking-[0.24em] text-gray-600">
              Light up coffee at home
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-[#1c1c1c] md:text-5xl">
              {heroCopy}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-gray-700">
              余白を活かしたミニマルな UI で、スペシャルティコーヒー豆の個性をそのままに。
              microCMS の既存スキーマを保ちつつ、Stripe 連携にも拡張できます。
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/menu"
                className="rounded-full bg-[#a4de02] px-6 py-3 text-sm font-semibold text-[#1f3b08] shadow-[0_14px_40px_rgba(164,222,2,0.45)] transition hover:-translate-y-[1px] hover:shadow-[0_18px_46px_rgba(164,222,2,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f3b08]"
              >
                豆を選ぶ
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-[#1f3b08] px-6 py-3 text-sm font-semibold text-[#1f3b08] transition hover:-translate-y-[1px] hover:bg-[#1f3b08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a4de02] focus-visible:ring-offset-2"
              >
                コンセプトを見る
              </Link>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <span className="rounded-full bg-white/80 px-4 py-2 shadow-sm">
                Single Origin / Microlot
              </span>
              <span className="rounded-full bg-white/80 px-4 py-2 shadow-sm">
                Light Roast &amp; Airy UI
              </span>
              <span className="rounded-full bg-white/80 px-4 py-2 shadow-sm">
                MicroCMS + Stripe Ready
              </span>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative col-span-2 h-56 overflow-hidden rounded-2xl">
                  <Image
                    src="/sample1.jpg"
                    alt="Light roast beans"
                    fill
                    sizes="(max-width: 768px) 100vw, 520px"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <p className="absolute bottom-4 left-4 text-sm font-semibold text-white">
                    Light roast, clean sweetness.
                  </p>
                </div>
                <div className="relative h-48 overflow-hidden rounded-2xl">
                  <Image
                    src="/sample2.jpg"
                    alt="Coffee brewing"
                    fill
                    sizes="(max-width: 768px) 100vw, 240px"
                    className="object-cover"
                  />
                </div>
                <div className="relative h-48 overflow-hidden rounded-2xl">
                  <Image
                    src="/sample3.jpg"
                    alt="Coffee cherry"
                    fill
                    sizes="(max-width: 768px) 100vw, 240px"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#0f1c0a] px-5 py-4 text-white">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/70">
                    Highlight
                  </p>
                  <p className="text-lg font-semibold">余白を活かしたミニマル設計</p>
                </div>
                <span className="rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#1f3b08]">
                  Lime #A4DE02
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-3">
        {[
          {
            title: "Minimal &amp; Airy",
            body: "余白 80px ベースのセクション設計。画像を大きく、テキストは必要最小限に。",
          },
          {
            title: "Performance Ready",
            body: "next/image で最適化。microCMS スキーマは変更せず、そのまま UI をアップデート。",
          },
          {
            title: "Stripe Expandable",
            body: "priceID を商品情報に追加すれば、そのまま Stripe Checkout へ拡張できる構造。",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-[#e6e6e6] bg-white/90 p-6 shadow-[0_18px_42px_rgba(0,0,0,0.06)]"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
              feature
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-[#1c1c1c]">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-700">
              {item.body}
            </p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20" id="menu">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-gray-500">
              Recommended
            </p>
            <h2 className="text-3xl font-semibold text-[#1c1c1c]">
              おすすめの豆
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              isRecommended=true の menu から最新 3 件をピックアップ。
            </p>
          </div>
          <Link
            href="/menu"
            className="text-sm font-semibold text-[#1f3b08] underline-offset-4 hover:underline"
          >
            すべての豆を見る
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {recommended.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#d6d6d6] bg-white p-8 text-center text-gray-600">
              おすすめの豆は準備中です。microCMS の isRecommended を設定すると表示されます。
            </div>
          )}
          {recommended.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              href={`/menu/${item.id}`}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-gray-500">
              Journal
            </p>
            <h2 className="text-3xl font-semibold text-[#1c1c1c]">
              ブログの最新記事
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              産地の背景や焙煎ノートなど、読みものを最新から 2 件表示します。
            </p>
          </div>
          <Link
            href="/blog"
            className="text-sm font-semibold text-[#1f3b08] underline-offset-4 hover:underline"
          >
            ブログ一覧へ
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {latestBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl px-6 py-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#f7fbf1] via-[#e6f3c6] to-[#f7fbf1]" />
        <div className="relative grid gap-10 md:grid-cols-[1.2fr,1fr] md:items-center">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.22em] text-gray-600">
              About
            </p>
            <h2 className="text-3xl font-semibold text-[#1c1c1c]">
              ブランドの約束
            </h2>
            <p className="text-lg leading-relaxed text-gray-800">
              Light Up Coffee のように、写真主導で静的なデザイン。白とライムグリーンで統一し、余白を大切にしています。
              microCMS のスキーマを変更せず、UI だけを刷新する方針です。
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-gray-700">
              <span className="rounded-full bg-white/80 px-4 py-2 shadow-sm">
                Noto Sans / Inter
              </span>
              <span className="rounded-full bg-white/80 px-4 py-2 shadow-sm">
                Section padding ≈ 80px
              </span>
              <span className="rounded-full bg-white/80 px-4 py-2 shadow-sm">
                next/image / SEO meta
              </span>
            </div>
          </div>
          <div className="relative h-80 overflow-hidden rounded-2xl border border-white/60 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
            <Image
              src="/sample2.jpg"
              alt="Coffee tasting"
              fill
              sizes="(max-width: 768px) 100vw, 520px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
            <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#1f3b08]">
              Quiet, minimal, honest.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
