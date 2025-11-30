'use client';

import { create } from "zustand";

export type CartItem = {
  productId: string;
  title: string;
  price: number;
  image?: string;
  qty: number;
  selectedRoast?: string;
  selectedGram: number;
};

type CartStore = {
  items: CartItem[];
  addToCart: (
    item: Omit<CartItem, "qty" | "selectedGram"> & {
      selectedGram?: number;
    },
    qty?: number
  ) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  updateGram: (productId: string, gram: number) => void;
  clearCart: () => void;
  totalQuantity: () => number;
  totalAmount: () => number;
  selectedRoast: (productId: string) => string | undefined;
  selectedGram: (productId: string) => number | undefined;
};

const clampQty = (qty: number) => Math.max(1, Math.min(10, qty));
const clampGram = (gram: number, minGram = 100) => {
  const base = Math.max(minGram, Math.min(1000, gram));
  return Math.round(base / 100) * 100;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addToCart: (item, qty = 1) =>
    set((state) => {
      const safeQty = clampQty(qty);
      const minGram =
        typeof item.selectedGram === "number"
          ? item.selectedGram
          : 100;
      const baseGram = clampGram(minGram);
      const existing = state.items.find(
        (cartItem) => cartItem.productId === item.productId
      );

      if (existing) {
        return {
          items: state.items.map((cartItem) =>
            cartItem.productId === item.productId
              ? {
                  ...cartItem,
                  qty: clampQty(cartItem.qty + safeQty),
                  selectedRoast: item.selectedRoast ?? cartItem.selectedRoast,
                  selectedGram: cartItem.selectedGram || baseGram,
                }
              : cartItem
          ),
        };
      }

      return {
        items: [
          ...state.items,
          {
            ...item,
            qty: safeQty,
            selectedRoast: item.selectedRoast,
            selectedGram: baseGram,
          },
        ],
      };
    }),
  removeFromCart: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    })),
  updateQty: (productId, qty) =>
    set((state) => ({
      items: state.items
        .map((item) =>
          item.productId === productId
            ? { ...item, qty: clampQty(qty) }
            : item
        )
        .filter((item) => item.qty > 0),
    })),
  updateGram: (productId, gram) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.productId === productId
          ? { ...item, selectedGram: clampGram(gram) }
          : item
      ),
    })),
  clearCart: () => set({ items: [] }),
  totalQuantity: () =>
    get().items.reduce((sum, item) => sum + item.qty, 0),
  totalAmount: () =>
    get().items.reduce(
      (sum, item) => sum + item.qty * item.price,
      0
    ),
  selectedRoast: (productId: string) =>
    get().items.find((item) => item.productId === productId)
      ?.selectedRoast,
  selectedGram: (productId: string) =>
    get().items.find((item) => item.productId === productId)
      ?.selectedGram,
}));
