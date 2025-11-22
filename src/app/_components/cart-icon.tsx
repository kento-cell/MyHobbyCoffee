'use client';

import Link from "next/link";
import { useCartStore } from "@/store/cart";

export const CartIcon = () => {
  const totalQty = useCartStore((state) => state.totalQuantity());

  return (
    <Link
      href="/cart"
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#dfe8c7] bg-white text-[#0f1c0a] shadow-[0_10px_32px_rgba(0,0,0,0.08)] transition hover:-translate-y-[1px] hover:shadow-[0_14px_36px_rgba(0,0,0,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f3b08] focus-visible:ring-offset-2"
      aria-label="カートページへ"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-5 w-5"
      >
        <path d="M4 5h2l1.5 10h9L18 8H6" strokeLinecap="round" />
        <circle cx="9" cy="18.2" r="1" />
        <circle cx="15" cy="18.2" r="1" />
      </svg>
      {totalQty > 0 && (
        <span className="absolute -right-1 -top-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[#a4de02] px-2 text-xs font-bold text-[#0f1c0a] shadow-[0_10px_22px_rgba(164,222,2,0.55)]">
          {totalQty}
        </span>
      )}
    </Link>
  );
};
