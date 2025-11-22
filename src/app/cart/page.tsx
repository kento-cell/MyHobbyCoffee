'use client';

import Image from "next/image";
import Link from "next/link";
import { QtySelector } from "../_components/qty-selector";
import { useCartStore } from "@/store/cart";

const formatPrice = (price: number) => `¥${price.toLocaleString()}`;

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQty = useCartStore((state) => state.updateQty);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalQty = useCartStore((state) => state.totalQuantity());
  const totalAmount = useCartStore((state) => state.totalAmount());

  return (
    <main className="mx-auto max-w-5xl px-6 pb-24 pt-12">
      <header className="mb-8 flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.22em] text-gray-500">
          Cart
        </p>
        <h1 className="text-3xl font-semibold text-[#1c1c1c]">
          カートの中身
        </h1>
        <p className="text-sm text-gray-700">
          microCMS の価格をそのまま利用し、数量を自由に調整できます。
        </p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#d6d6d6] bg-white px-8 py-12 text-center shadow-sm">
          <p className="text-lg font-semibold text-[#1c1c1c]">
            カートは空です。
          </p>
          <p className="mt-2 text-sm text-gray-600">
            メニューからお好みの豆をカートに追加してください。
          </p>
          <Link
            href="/menu"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#a4de02] px-5 py-3 text-sm font-semibold text-[#0f1c0a] shadow-[0_12px_36px_rgba(164,222,2,0.45)] transition hover:-translate-y-[1px] hover:shadow-[0_16px_44px_rgba(164,222,2,0.55)]"
          >
            メニューを見る
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.7fr,1fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex flex-col gap-4 rounded-3xl border border-[#e8e8e8] bg-white p-5 shadow-[0_12px_32px_rgba(0,0,0,0.05)] md:flex-row md:items-center"
              >
                <div className="relative h-28 w-full overflow-hidden rounded-2xl bg-[#f5f5f5] md:h-28 md:w-28">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                      No image
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-2">
                  <Link
                    href={`/menu/${item.productId}`}
                    className="text-lg font-semibold text-[#1c1c1c] hover:text-[#1f3b08]"
                  >
                    {item.title}
                  </Link>
                  <div className="text-sm text-gray-600">
                    {formatPrice(item.price)} / bag
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <QtySelector
                      value={item.qty}
                      onChange={(qty) => updateQty(item.productId, qty)}
                    />
                    <span className="text-sm font-semibold text-[#1f3b08]">
                      小計 {formatPrice(item.price * item.qty)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId)}
                      className="text-sm font-semibold text-[#c2410c] underline-offset-4 hover:underline"
                    >
                      削除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="space-y-4 rounded-3xl border border-[#e8e8e8] bg-white p-6 shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">商品数</span>
              <span className="text-base font-semibold text-[#1c1c1c]">
                {totalQty} 点
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">合計金額</span>
              <span className="text-2xl font-bold text-[#1f3b08]">
                {formatPrice(totalAmount)}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Stripe 連携は後日追加予定のため、現在は UI のみです。
            </p>
            <button
              type="button"
              className="flex w-full items-center justify-center rounded-full bg-[#a4de02] px-5 py-3 text-sm font-semibold text-[#0f1c0a] shadow-[0_14px_44px_rgba(164,222,2,0.5)] transition hover:-translate-y-[1px] hover:shadow-[0_16px_52px_rgba(164,222,2,0.6)]"
            >
              購入へ進む (UI のみ)
            </button>
            <button
              type="button"
              onClick={clearCart}
              className="w-full rounded-full border border-[#e6e6e6] px-5 py-3 text-sm font-semibold text-[#1c1c1c] transition hover:bg-[#f5f5f5]"
            >
              カートを空にする
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}
