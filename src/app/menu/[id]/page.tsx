import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getImageUrl, getMenu, MenuItem } from "@/lib/microcms";
import { PurchasePanel } from "./purchase-panel";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const formatPrice = (price?: number | string) => {
  if (typeof price === "number") return `¥${price.toLocaleString()}`;
  const numeric = Number(price);
  return Number.isFinite(numeric)
    ? `¥${numeric.toLocaleString()}`
    : "価格未設定";
};

export default async function MenuDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const item = await getMenu(params.id);

  if (!item) {
    notFound();
  }

  const roastLabel = item.roast
    ? Array.isArray(item.roast)
      ? item.roast.join(" / ")
      : item.roast
    : "未設定";
  const originLabel = item.origin || "未設定";
  const processLabel = item.process || "未設定";
  const amountLabel =
    typeof item.amount === "number"
      ? `${item.amount}g`
      : item.amount || "未設定";

  return (
    <main className="mx-auto max-w-4xl px-5 pb-18 pt-10 md:px-6 md:pb-20 md:pt-12">
      <Link
        href="/menu"
        className="text-sm font-semibold text-[#1f3b08] underline-offset-4 hover:underline"
      >
        一覧に戻る
      </Link>

      <div className="mt-7 flex flex-col gap-6">
        <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-white/70 bg-white shadow-[0_14px_32px_rgba(0,0,0,0.08)]">
          <div className="relative aspect-[4/3] max-h-[360px] w-full">
          <Image
            src={getImageUrl(item.image?.url)}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 720px"
            className="h-full w-full object-cover"
            priority
          />
          </div>
          <div className="absolute left-4 top-4 rounded-full bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#1f3b08] shadow-sm md:left-5 md:top-5">
            Light roast specialty
          </div>
        </div>

        <div className="mx-auto w-full max-w-3xl space-y-6 rounded-2xl bg-white/90 p-5 shadow-[0_12px_28px_rgba(0,0,0,0.06)] md:p-7">
          <div className="space-y-2.5">
            <p className="text-xs uppercase tracking-[0.22em] text-gray-500">
              Menu
            </p>
            <h1 className="text-3xl font-semibold text-[#1c1c1c]">
              {item.name}
            </h1>
            <p className="text-lg font-bold text-[#1f3b08]">
              {formatPrice(item.price)}
            </p>
          </div>

          <div className="grid gap-3 rounded-2xl border border-[#e8e8e8] bg-[#f7fbf1] p-4 md:grid-cols-2">
            <InfoRow label="Origin (origin)" value={originLabel} />
            <InfoRow label="Roast (roast)" value={roastLabel} />
            <InfoRow label="Process (process)" value={processLabel} />
            <InfoRow label="Amount (g)" value={amountLabel} />
            <InfoRow label="ID" value={item.id} />
          </div>

          {item.description && (
            <div className="rounded-2xl border border-[#e8e8e8] bg-white px-6 py-5 text-gray-800 shadow-sm">
              <p className="whitespace-pre-line leading-relaxed">
                {item.description}
              </p>
            </div>
          )}

          <PurchasePanel item={item} />

          <ApiData item={item} />
        </div>
      </div>
    </main>
  );
}

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="flex flex-col gap-1 rounded-xl bg-white px-4 py-3 shadow-sm">
    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
      {label}
    </span>
    <span className="text-sm font-semibold text-[#1c1c1c]">{value}</span>
  </div>
);

const ApiData = ({ item }: { item: MenuItem }) => {
  return (
    <section className="rounded-2xl border border-dashed border-[#d6d6d6] bg-white px-5 py-4 text-sm text-gray-800 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
          API データ
        </span>
        <span className="rounded-full bg-[#f5f9eb] px-3 py-1 text-[11px] font-semibold text-[#3f5c1f]">
          /api/menu/{item.id}
        </span>
      </div>
      <pre className="max-h-64 overflow-auto rounded-lg bg-[#f7fbf1] p-3 text-xs text-gray-900">
        {JSON.stringify(item, null, 2)}
      </pre>
    </section>
  );
};
