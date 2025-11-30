"use client";

import { useEffect, useState, KeyboardEvent, MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BlogEntry, MenuItem, getImageUrl } from "@/lib/microcms";
import { QtySelector } from "./qty-selector";
import { useCartStore } from "@/store/cart";
import { useToast } from "./toast-provider";

type ProductCardProps = {
  item: MenuItem;
  href?: string;
  enableAddToCart?: boolean;
  soldOut?: boolean;
};

export const ProductCard = ({
  item,
  href,
  enableAddToCart,
  soldOut,
}: ProductCardProps) => {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const baseGram =
    typeof item.amount === "number"
      ? Math.max(100, Math.round(item.amount / 100) * 100)
      : 100;
  const gramOptions = Array.from(
    { length: Math.max(1, Math.floor((1000 - baseGram) / 100) + 1) },
    (_, i) => baseGram + i * 100
  );
  const [selectedGram, setSelectedGram] = useState<number>(gramOptions[0]);
  const roastOptions = Array.isArray(item.roast)
    ? item.roast.filter(Boolean)
    : item.roast
      ? [item.roast]
      : [];
  const [selectedRoast, setSelectedRoast] = useState<string | undefined>(
    roastOptions[0]
  );
  const [showRaw, setShowRaw] = useState(false);
  const [rawLoading, setRawLoading] = useState(false);
  const [rawData, setRawData] = useState<unknown | null>(null);
  const [rawError, setRawError] = useState<string | null>(null);
  const addToCart = useCartStore((state) => state.addToCart);
  const { pushToast } = useToast();

  useEffect(() => {
    if (!showRaw) return;
    if (!item?.id) return;
    const controller = new AbortController();

    (async () => {
      setRawLoading(true);
      setRawError(null);
      try {
        const res = await fetch(`/api/menu/${item.id}`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          setRawError(`HTTP ${res.status}`);
          setRawData(null);
        } else {
          const json = await res.json();
          setRawData(json);
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        const message = err instanceof Error ? err.message : String(err);
        setRawError(message);
        setRawData(null);
      } finally {
        setRawLoading(false);
      }
    })();

    return () => controller.abort();
  }, [showRaw, item?.id]);

  const priceLabel =
    typeof item.price === "number"
      ? `¥${item.price.toLocaleString()}`
      : "価格はお問い合わせください";

  const handleNavigate = () => {
    if (!href || soldOut) return;
    router.push(href);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!href || soldOut) return;
    if (event.currentTarget !== event.target) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleNavigate();
    }
  };

  const handleAdd = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!enableAddToCart || soldOut) return;
    const price = typeof item.price === "number" ? item.price : 0;
    addToCart(
      {
        productId: item.id,
        title: item.name,
        price,
        image: getImageUrl(item.image?.url),
        selectedGram,
        selectedRoast,
      },
      qty
    );
    pushToast(`${item.name} を ${qty} 点カートに追加しました`);
  };

  const cover = (
    <div className="relative h-52 w-full overflow-hidden">
      {soldOut && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 text-sm font-semibold uppercase tracking-[0.2em] text-white">
          SOLD OUT
        </div>
      )}
      <div className="absolute left-0 top-0 h-full w-1 bg-[#a4de02]" />
      <Image
        src={getImageUrl(item.image?.url)}
        alt={item.name}
        fill
        sizes="(max-width: 768px) 100vw, 380px"
        className="object-cover transition duration-500 group-hover:scale-105"
        priority={false}
      />
    </div>
  );

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(0,0,0,0.08)] ${
        href && !soldOut ? "cursor-pointer" : ""
      }`}
      role={href && !soldOut ? "link" : undefined}
      tabIndex={href && !soldOut ? 0 : undefined}
      aria-label={href ? `${item.name} の詳細を見る` : undefined}
      onClick={href ? handleNavigate : undefined}
      onKeyDown={href ? handleKeyDown : undefined}
    >
      {href && !soldOut ? (
        <Link
          href={href}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a4de02] focus-visible:ring-offset-4 focus-visible:ring-offset-white"
          onClick={(event) => event.stopPropagation()}
        >
          {cover}
        </Link>
      ) : (
        cover
      )}

      <div className="flex flex-1 flex-col gap-3 px-5 pb-6 pt-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-gray-500">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#f5f9eb] px-3 py-1 text-[11px] text-[#3f5c1f]">
            Light roast craft
          </span>
          {item.roast && (
            <span className="text-gray-600">
              {Array.isArray(item.roast) ? item.roast.join(" / ") : item.roast}
            </span>
          )}
        </div>

        <h3 className="text-xl font-semibold tracking-tight text-[#222222]">
          {href && !soldOut ? (
            <Link
              href={href}
              className="transition hover:text-[#1f3b08] hover:underline"
              onClick={(event) => event.stopPropagation()}
            >
              {item.name}
            </Link>
          ) : (
            item.name
          )}
        </h3>

        {item.origin && (
          <p className="text-sm text-gray-600">Origin: {item.origin}</p>
        )}

        {item.description && (
          <p className="line-clamp-3 text-sm leading-relaxed text-gray-700">
            {item.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="text-lg font-semibold text-[#1f3b08]">
            {priceLabel}
          </span>
          {href && !soldOut && (
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-gray-500">
              View detail
            </span>
          )}
          {soldOut && (
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-red-600">
              SOLD OUT
            </span>
          )}
        </div>

        {enableAddToCart && (
          <div
            className="mt-3 flex flex-col gap-3"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <div className="flex flex-wrap items-center gap-3">
              <QtySelector value={qty} onChange={setQty} compact />
              <label className="flex items-center gap-2 text-xs font-semibold text-[#1f3b08]">
                焙煎度
                <select
                  value={selectedRoast || ""}
                  onChange={(e) => setSelectedRoast(e.target.value)}
                  className="rounded-lg border border-[#dcdcdc] bg-white px-2 py-1"
                  disabled={soldOut}
                >
                  {roastOptions.length === 0 && (
                    <option value="">未指定</option>
                  )}
                  {roastOptions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#1f3b08]">
                グラム
                <select
                  value={selectedGram}
                  onChange={(e) => setSelectedGram(Number(e.target.value))}
                  className="rounded-lg border border-[#dcdcdc] bg-white px-2 py-1"
                  disabled={soldOut}
                >
                  {gramOptions.map((g) => (
                    <option key={g} value={g}>
                      {g}g
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleAdd}
                disabled={soldOut}
                className="inline-flex items-center justify-center rounded-full bg-[#a4de02] px-4 py-2 text-sm font-semibold text-[#0f1c0a] shadow-[0_12px_32px_rgba(164,222,2,0.45)] transition hover:-translate-y-[1px] hover:shadow-[0_16px_40px_rgba(164,222,2,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f3b08] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                カートに追加
              </button>
            </div>
          </div>
        )}

        <div
          className="mt-3"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setShowRaw((s) => !s);
            }}
            className="text-xs text-gray-600 underline-offset-2 hover:underline"
          >
            {showRaw ? "API データを隠す" : "API データを表示"}
          </button>

          {showRaw && (
            <div className="mt-2">
              {rawLoading ? (
                <div className="text-xs text-gray-600">読み込み中…</div>
              ) : rawError ? (
                <div className="text-xs text-red-600">エラー: {rawError}</div>
              ) : (
                <pre className="max-h-48 w-full overflow-auto rounded bg-gray-100 p-3 text-xs text-gray-800">
                  {JSON.stringify(rawData ?? item, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

type BlogCardProps = {
  blog: BlogEntry;
};

export const BlogCard = ({ blog }: BlogCardProps) => {
  return (
    <Link
      href={`/blog/${blog.id}`}
      className="group flex h-full flex-col gap-3 rounded-2xl border border-[#e8e8e8] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] focus:outline-none focus:ring-2 focus:ring-[#a4de02] focus:ring-offset-4 focus:ring-offset-white"
    >
      {blog.eyecatch?.url && (
        <div className="relative h-44 w-full overflow-hidden rounded-xl">
          <Image
            src={blog.eyecatch.url}
            alt={blog.title}
            fill
            sizes="(max-width: 768px) 100vw, 360px"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex items-center gap-2 text-[13px] uppercase tracking-[0.14em] text-gray-500">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#f5f9eb] px-3 py-1 text-[11px] text-[#3f5c1f]">
          Coffee journal
        </span>
        {blog.date && <span>{blog.date}</span>}
      </div>

      <h3 className="text-xl font-semibold leading-tight text-[#1c1c1c]">
        {blog.title}
      </h3>

      <p className="text-sm text-gray-600">
        {blog.category?.name ? `Category: ${blog.category.name}` : "Story"}
      </p>

      <span className="mt-auto text-[13px] font-medium text-[#1f3b08] underline-offset-4 group-hover:underline">
        Read article
      </span>
    </Link>
  );
};
