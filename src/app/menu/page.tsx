import Image from "next/image";
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

  const gallery =
    topBackground?.gallery?.filter((img) => img.url) ?? [];
  const primaryHeroImage = topBackground?.primary ?? gallery[0];
  const collageImages = gallery.filter(
    (image) => image.url && image.url !== primaryHeroImage?.url
  );

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
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/75 to-white" />
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
              コーヒー豆一覧
            </h1>
            <p className="text-sm leading-relaxed text-gray-700 md:text-base">
              Topbk/Topbk2 に登録した画像だけを背景に配置しています。API からの画像が無ければグラデーションのみで表示されます。
            </p>
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

      <section className="mx-auto mt-12 max-w-6xl px-6">
        <div className="mb-8 flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.22em] text-gray-500">
            Menu
          </p>
          <h2 className="text-3xl font-semibold text-[#1c1c1c]">
            コーヒー豆一覧
          </h2>
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
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}
