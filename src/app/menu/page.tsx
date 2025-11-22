import { ProductCard } from "../_components/cards";
import { getMenuAll } from "@/lib/microcms";

export default async function MenuPage() {
  const { contents } = await getMenuAll();

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-12">
      <header className="mb-10 flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.22em] text-gray-500">
          Menu
        </p>
        <h1 className="text-3xl font-semibold text-[#1c1c1c]">コーヒー豆一覧</h1>
        <p className="text-sm text-gray-700">
          microCMS の menu スキーマをそのまま利用。isRecommended や origin、
          roast など任意のフィールドを表示します。
        </p>
      </header>

      <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {contents.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            href={`/menu/${item.id}`}
            enableAddToCart
          />
        ))}
      </section>
    </main>
  );
}
