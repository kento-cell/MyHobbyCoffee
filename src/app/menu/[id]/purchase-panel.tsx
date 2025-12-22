'use client';

import { useState } from "react";
import { MenuItem, getImageUrl } from "@/lib/microcms";
import { QtySelector } from "../../_components/qty-selector";
import { useCartStore } from "@/store/cart";
import { useToast } from "../../_components/toast-provider";

const parseNumber = (value: number | string | undefined | null, fallback = 0) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : fallback;
  if (typeof value === "string") {
    const cleaned = value.replace(/[^\d.-]/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
};

const formatPrice = (price?: number | string) => {
  const numeric = parseNumber(price, NaN);
  return Number.isFinite(numeric)
    ? `¥${numeric.toLocaleString()}`
    : "価格はお問い合わせください";
};

type Props = {
  item: MenuItem;
  soldOut?: boolean;
  stockGram?: number;
};

export const PurchasePanel = ({ item, soldOut, stockGram = 0 }: Props) => {
  const sortRoastOptions = (options: string[]) =>
    [...options].sort((a, b) => {
      const rank = (v: string) =>
        v.includes("浅") ? 0 : v.includes("中") ? 1 : v.includes("深") ? 2 : 3;
      const ra = rank(a);
      const rb = rank(b);
      if (ra !== rb) return ra - rb;
      return a.localeCompare(b, "ja");
    });

  const basePrice = parseNumber(item.price, 0);
  const baseGram = Math.max(100, Math.round(parseNumber(item.amount, 100) / 100) * 100);
  const [qty, setQty] = useState(1);
  const [gram, setGram] = useState<number>(baseGram);
  const roastOptions = sortRoastOptions(
    Array.isArray(item.roast)
      ? item.roast.filter(Boolean)
      : item.roast
        ? [item.roast]
        : []
  );
  const [roast, setRoast] = useState<string | undefined>(
    roastOptions[0] ?? (Array.isArray(item.roast) ? item.roast[0] : item.roast)
  );
  const addToCart = useCartStore((state) => state.addToCart);
  const { pushToast } = useToast();

  const priceForSelectedGram = Math.round(
    (basePrice * Math.max(baseGram, gram)) / Math.max(1, baseGram)
  );

  const handleAdd = () => {
    if (soldOut) return;
    addToCart(
      {
        productId: item.id,
        title: item.name,
        price: basePrice,
        image: getImageUrl(item.image?.url),
        selectedGram: gram,
        selectedRoast: roast,
        baseGram,
      },
      qty
    );
    pushToast(`${item.name} を ${gram}g × ${qty} 点カートに追加しました`);
  };

  const maxBuyableGram = Math.max(
    baseGram,
    Math.min(1000, stockGram > 0 ? stockGram : 1000)
  );

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#e8e8e8] bg-[#f7fbf1] px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-[0.2em] text-[#3f5c1f]">
          Stripe Ready
        </p>
        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1f3b08]">
          UI Only
        </span>
      </div>
      <p className="text-3xl font-bold text-[#1f3b08]">
        {formatPrice(priceForSelectedGram)}
        <span className="ml-2 text-base font-semibold text-[#3f5c1f]">
          / {gram}g
        </span>
      </p>
      <div className="text-sm text-gray-700">
        基準価格 {formatPrice(basePrice)} / {baseGram}g
      </div>
      {item.amount && (
        <div className="text-sm font-semibold text-[#1f3b08]">
          最小量 {typeof item.amount === "number" ? `${item.amount}g` : item.amount}
        </div>
      )}
      {stockGram !== undefined && (
        <div className="text-sm text-gray-700">
          在庫: {stockGram}g
        </div>
      )}
      <div className="text-sm text-gray-700">
        microCMS の基準価格をもとに、選択したグラムへ自動換算しています。
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <label className="flex items-center gap-2 font-semibold text-[#1f3b08]">
          グラム
          <input
            type="number"
            min={baseGram}
            max={maxBuyableGram || 1000}
            step={100}
            value={gram}
            onChange={(e) => {
              const next = Math.round(Number(e.target.value) / 100) * 100;
              setGram(
                Math.max(
                  baseGram,
                  Math.min(maxBuyableGram || 1000, next || baseGram)
                )
              );
            }}
            className="w-24 rounded-lg border border-[#dcdcdc] bg-white px-3 py-2"
            disabled={soldOut}
          />
        </label>
        <label className="flex items-center gap-2 font-semibold text-[#1f3b08]">
          焙煎度
          <select
            value={roast || ""}
            onChange={(e) => setRoast(e.target.value)}
            className="w-36 rounded-lg border border-[#dcdcdc] bg-white px-3 py-2"
            disabled={soldOut}
          >
            {roastOptions.length === 0 && <option value="">未設定</option>}
            {roastOptions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <QtySelector value={qty} onChange={setQty} disabled={soldOut} />
        <button
          type="button"
          onClick={handleAdd}
          disabled={soldOut}
          className="inline-flex items-center justify-center rounded-full bg-[#a4de02] px-5 py-3 text-sm font-semibold text-[#1f3b08] shadow-[0_12px_36px_rgba(164,222,2,0.45)] transition hover:-translate-y-[1px] hover:shadow-[0_16px_44px_rgba(164,222,2,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f3b08] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          カートに追加
        </button>
        {soldOut && (
          <span className="text-xs font-semibold text-red-600">SOLD OUT</span>
        )}
      </div>
    </div>
  );
};
