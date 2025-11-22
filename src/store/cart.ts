'use client';

import { create } from "zustand";

export type CartItem = {
  productId: string;
  title: string;
  price: number;
  image?: string;
  qty: number;
};

type CartStore = {
  items: CartItem[];
  addToCart: (
    item: Omit<CartItem, "qty">,
    qty?: number
  ) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  totalQuantity: () => number;
  totalAmount: () => number;
};

const clampQty = (qty: number) => Math.max(1, Math.min(10, qty));

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addToCart: (item, qty = 1) =>
    set((state) => {
      const safeQty = clampQty(qty);
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
  clearCart: () => set({ items: [] }),
  totalQuantity: () =>
    get().items.reduce((sum, item) => sum + item.qty, 0),
  totalAmount: () =>
    get().items.reduce(
      (sum, item) => sum + item.qty * item.price,
      0
    ),
}));
