'use client';

import { useState } from "react";
import { MenuItem, getImageUrl } from "@/lib/microcms";
import { QtySelector } from "../../_components/qty-selector";
import { useCartStore } from "@/store/cart";
import { useToast } from "../../_components/toast-provider";

const formatPrice = (price?: number | string) => {
  if (typeof price === "number") return `¥${price.toLocaleString()}`;
  const numeric = Number(price);
  return Number.isFinite(numeric)
    ? `¥${numeric.toLocaleString()}`
    : "価格はお問い合わせください";
};

export const PurchasePanel = ({ item }: { item: MenuItem }) => {
  const [qty, setQty] = useState(1);
  const addToCart = useCartStore((state) => state.addToCart);
  const { pushToast } = useToast();

  const handleAdd = () => {
    const price =
      typeof item.price === "number"
        ? item.price
        : Number(item.price) || 0;
    addToCart(
      {
        productId: item.id,
        title: item.name,
        price,
        image: getImageUrl(item.image?.url),
      },
      qty
    );
    pushToast(`${item.name} を ${qty} 点カートに追加しました`);
  };

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
        {formatPrice(item.price)}
      </p>
      {item.amount && (
        <div className="text-sm font-semibold text-[#1f3b08]">
          内容量:{" "}
          {typeof item.amount === "number"
            ? `${item.amount}g`
            : item.amount}
        </div>
      )}
      <div className="text-sm text-gray-700">
        microCMS の価格をそのまま利用。サイズは後日 API で可変化予定です。
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <QtySelector value={qty} onChange={setQty} />
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center justify-center rounded-full bg-[#a4de02] px-5 py-3 text-sm font-semibold text-[#1f3b08] shadow-[0_12px_36px_rgba(164,222,2,0.45)] transition hover:-translate-y-[1px] hover:shadow-[0_16px_44px_rgba(164,222,2,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f3b08] focus-visible:ring-offset-2"
        >
          カートに追加
        </button>
        <button
          type="button"
          className="inline-flex w-fit items-center justify-center rounded-full border border-[#e0e0e0] px-4 py-2 text-xs font-semibold text-[#1f3b08] shadow-sm"
          aria-label="Stripe Checkout is coming soon"
          disabled
        >
          Stripe Checkout (準備中)
        </button>
      </div>
    </div>
  );
};
