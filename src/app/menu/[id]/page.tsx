import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMenuAll, getImageUrl } from "@/lib/microcms";

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
  const { contents } = await getMenuAll();
  const item = contents.find((p) => p.id === params.id);

  if (!item) {
    notFound();
  }

  const roastLabel = item.roast
    ? Array.isArray(item.roast)
      ? item.roast.join(" / ")
      : item.roast
    : "未設定";

  return (
    <main className="mx-auto max-w-5xl px-6 pb-24 pt-12">
      <Link
        href="/menu"
        className="text-sm font-semibold text-[#1f3b08] underline-offset-4 hover:underline"
      >
        一覧に戻る
      </Link>

      <div className="mt-8 grid gap-8 md:grid-cols-[1.2fr,1fr] md:items-start">
        <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <Image
            src={getImageUrl(item.image?.url)}
            alt={item.name}
            width={1200}
            height={900}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 720px"
            className="h-full w-full object-cover"
            priority
          />
          <div className="absolute left-4 top-4 rounded-full bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#1f3b08] shadow-sm md:left-6 md:top-6">
            Light roast specialty
          </div>
        </div>

        <div className="space-y-6 rounded-3xl bg-white/90 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.06)] md:p-8">
          <div className="space-y-2">
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
            <InfoRow label="Origin (origin)" value={item.origin || "未設定"} />
            <InfoRow label="Roast (roast)" value={roastLabel} />
            <InfoRow label="Process (process)" value={item.process || "未設定"} />
            <InfoRow label="ID" value={item.id} />
          </div>

          {item.description && (
            <div className="rounded-2xl border border-[#e8e8e8] bg-white px-6 py-5 text-gray-800 shadow-sm">
              <p className="whitespace-pre-line leading-relaxed">
                {item.description}
              </p>
            </div>
          )}
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
