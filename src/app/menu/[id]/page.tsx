import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getImageUrl, getMenu } from "@/lib/microcms";
import { PurchasePanel } from "./purchase-panel";

export const revalidate = 120;

const fetchMenu = async (id: string) => {
  try {
    return await getMenu(id);
  } catch {
    return null;
  }
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const data = await fetchMenu(params.id);
  if (!data) {
    return { title: "メニューが見つかりません | MyHobbyCoffee" };
  }

  return {
    title: `${data.name} | MyHobbyCoffee`,
    description: data.description || "スペシャルティコーヒー豆の詳細ページ",
    openGraph: {
      title: data.name,
      description: data.description || "",
      images: [{ url: getImageUrl(data.image?.url) }],
    },
  };
}

export default async function MenuDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await fetchMenu(params.id);

  if (!data) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 pb-24 pt-12">
      <Link
        href="/menu"
        className="text-sm font-semibold text-[#1f3b08] underline-offset-4 hover:underline"
      >
        一覧に戻る
      </Link>

      <div className="mt-8 grid gap-10 md:grid-cols-[1.2fr,1fr] md:items-start">
        <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <Image
            src={getImageUrl(data.image?.url)}
            alt={data.name}
            width={1100}
            height={760}
            className="h-full w-full object-cover"
            priority
          />
          <div className="absolute left-6 top-6 rounded-full bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#1f3b08] shadow-sm">
            Light roast specialty
          </div>
        </div>

        <div className="space-y-6 rounded-3xl bg-white/90 p-8 shadow-[0_18px_48px_rgba(0,0,0,0.06)]">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-gray-500">
              Menu
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-[#1c1c1c]">
              {data.name}
            </h1>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {data.origin && (
              <InfoPill label="Origin" value={data.origin} accent />
            )}
            {data.roast && (
              <InfoPill
                label="Roast"
                value={
                  Array.isArray(data.roast)
                    ? data.roast.join(" / ")
                    : data.roast
                }
              />
            )}
            {data.process && (
              <InfoPill label="Process" value={data.process} />
            )}
          </div>

          <PurchasePanel item={data} />

          {data.description && (
            <div className="rounded-2xl border border-[#e8e8e8] bg-white px-6 py-5 text-gray-800 shadow-sm">
              <p className="whitespace-pre-line leading-relaxed">
                {data.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

const InfoPill = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) => {
  return (
    <div
      className={`rounded-full px-4 py-3 text-sm font-semibold ${
        accent
          ? "bg-[#0f1c0a] text-white"
          : "bg-[#f5f5f5] text-[#1c1c1c]"
      }`}
    >
      <span className="text-xs uppercase tracking-[0.18em] text-gray-500">
        {label}{" "}
      </span>
      <span className="text-base font-semibold">{value}</span>
    </div>
  );
};
