import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "../_components/cards";
import { getMenuAll, getTopBackground } from "@/lib/microcms";
import { supabaseService } from "@/lib/supabase";

const getStocks = async () => {
  if (!supabaseService) return {};
  const { data } = await supabaseService
    .from("bean_stocks")
    .select("bean_name, stock_grams");
  return (
    data?.reduce<Record<string, number>>((acc, row) => {
      acc[row.bean_name] = row.stock_grams ?? 0;
      return acc;
    }, {}) || {}
  );
};

export default async function MenuPage() {
  const [{ contents }, topBackground, stocks] = await Promise.all([
    getMenuAll(),
    getTopBackground(),
    getStocks(),
  ]);

  const gallery = topBackground?.gallery?.filter((img) => img.url) ?? [];
  const primaryHeroImage = topBackground?.primary ?? gallery[0];
  const collageImages = gallery.filter(
    (image) => image.url && image.url !== primaryHeroImage?.url
  );

  const availableCount = contents.filter((item) => (stocks[item.name] ?? 0) > 0).length;
  const soldOutCount = contents.length - availableCount;

  return (
    <main className="pb-24">
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#f7fbf1] via-white to-[#eef6e0]">
        <div className="absolute inset-0 -z-10">
          {primaryHeroImage?.url && (
            <Image
              src={primaryHeroImage.url}
              alt="Top background"
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-white" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(164,222,2,0.18),transparent_32%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_12%,rgba(35,78,19,0.08),transparent_30%)]" />
        </div>

        {collageImages.length > 0 && (
          <div className="pointer-events-none absolute inset-y-8 right-6 z-0 hidden w-[380px] rotate-2 overflow-hidden rounded-3xl border border-white/50 bg-white/40 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.08)] backdrop-blur md:block lg:right-10 lg:w-[460px]">
            <div className="grid grid-cols-2 gap-4">
              {collageImages.slice(0, 4).map((image, index) => (
                <div
                  key={`${image.url}-${index}`}
                  className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white/50"
                >
                  <Image
                    src={image.url}
                    alt={`Top background ${index + 1}`}
                    fill
                    sizes="(max-width: 1024px) 45vw, 220px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20 lg:py-24">
          <div className="max-w-2xl space-y-5">
            <p className="text-xs uppercase tracking-[0.22em] text-gray-600">
              Menu
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-[#1c1c1c] md:text-5xl">
              シングルオリジンとブレンドのメニュー
            </h1>
            <p className="text-sm leading-relaxed text-gray-700 md:text-base">
              焙煎度・グラムを選んで注文できます。お気に入りを見つけたら、詳細ページでフレーバーノートもご確認ください。
            </p>
            <div className="flex flex-wrap gap-3 text-xs font-semibold text-[#1f3b08]">
              <span className="rounded-full bg-white/80 px-3 py-2 shadow-sm">
                在庫同期: Supabase
              </span>
              <span className="rounded-full bg-white/80 px-3 py-2 shadow-sm">
                画像: microCMS
              </span>
              <span className="rounded-full bg-white/80 px-3 py-2 shadow-sm">
                決済: Stripe
              </span>
            </div>
          </div>

          {collageImages.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-3 md:hidden">
              {collageImages.slice(0, 4).map((image, index) => (
                <div
                  key={`${image.url}-mobile-${index}`}
                  className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/60 bg-white/70 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
                >
                  <Image
                    src={image.url}
                    alt={`Top background ${index + 1}`}
                    fill
                    sizes="50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto -mt-6 max-w-6xl px-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-[#e7f2cd] bg-gradient-to-r from-[#f7fbf1] via-white to-[#eef6e0] px-6 py-6 shadow-[0_14px_40px_rgba(0,0,0,0.05)] md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.18em] text-gray-600">AI Coffee Match</p>
            <h3 className="text-xl font-semibold text-[#1c1c1c]">迷ったら診断、相性の良い豆を提案</h3>
            <p className="text-sm text-gray-700">
              好みのフレーバーを選ぶだけで、おすすめの4種をピックアップ。気になる豆はそのままカートへ。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/recommender/questions"
              className="rounded-full bg-[#a4de02] px-5 py-3 text-sm font-semibold text-[#0f1c0a] shadow-[0_12px_34px_rgba(164,222,2,0.45)] transition hover:-translate-y-[1px]"
            >
              AI診断を試す
            </Link>
            <Link
              href="/recommender/start"
              className="text-sm font-semibold text-[#1f3b08] underline-offset-4 hover:underline"
            >
              診断の流れを見る
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-6xl px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.22em] text-gray-500">Menu</p>
            <h2 className="text-3xl font-semibold text-[#1c1c1c]">
              焙煎したてのメニュー一覧
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 text-xs font-semibold text-[#1f3b08]">
            <span className="rounded-full bg-[#f5f9eb] px-3 py-2 shadow-sm">
              在庫あり: {availableCount} 件
            </span>
            <span className="rounded-full bg-white px-3 py-2 shadow-sm">
              売り切れ: {soldOutCount} 件
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {contents.map((item) => {
            const stock = stocks[item.name] ?? 0;
            const soldOut = stock <= 0;
            return (
              <ProductCard
                key={item.id}
                item={item}
                href={`/menu/${item.id}`}
                enableAddToCart
                soldOut={soldOut}
                stockGrams={stock}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}
