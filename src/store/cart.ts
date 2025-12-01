'use client';

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  lineId: string;
  productId: string;
  title: string;
  price: number;
  image?: string;
  qty: number;
  selectedRoast?: string;
  selectedGram: number;
  baseGram: number;
};

type CartStore = {
  items: CartItem[];
  addToCart: (
    item: Omit<CartItem, "qty" | "selectedGram" | "baseGram" | "lineId"> & {
      selectedGram?: number;
      baseGram?: number;
    },
    qty?: number
  ) => void;
  removeFromCart: (lineId: string) => void;
  updateQty: (lineId: string, qty: number) => void;
  updateGram: (lineId: string, gram: number) => void;
  clearCart: () => void;
  totalQuantity: () => number;
  totalAmount: () => number;
  selectedRoast: (lineId: string) => string | undefined;
  selectedGram: (lineId: string) => number | undefined;
};

const clampQty = (qty: number) => Math.max(1, Math.min(10, qty));
const clampGram = (gram: number, minGram = 100) => {
  const base = Math.max(minGram, Math.min(1000, gram));
  return Math.round(base / 100) * 100;
};

const createLineId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `line_${Date.now()}_${Math.random().toString(16).slice(2)}`;

const normalizeBaseGram = (gram?: number) => {
  if (typeof gram === "number" && Number.isFinite(gram)) {
    return clampGram(gram);
  }
  return 100;
};

export const calculateUnitPrice = (item: CartItem) => {
  const baseGram = Math.max(1, item.baseGram || 100);
  const selectedGram = Math.max(baseGram, item.selectedGram || baseGram);
  return Math.round((item.price * selectedGram) / baseGram);
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (item, qty = 1) =>
        set((state) => {
          const safeQty = clampQty(qty);
          const baseGram = clampGram(
            normalizeBaseGram(item.baseGram ?? item.selectedGram)
          );
          const selectedGram = clampGram(
            typeof item.selectedGram === "number"
              ? item.selectedGram
              : baseGram,
            baseGram
          );
          return {
            items: [
              ...state.items,
              {
                lineId: createLineId(),
                ...item,
                qty: safeQty,
                selectedRoast: item.selectedRoast,
                selectedGram,
                baseGram,
              },
            ],
          };
        }),
      removeFromCart: (lineId) =>
        set((state) => ({
          items: state.items.filter((item) => item.lineId !== lineId),
        })),
      updateQty: (lineId, qty) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.lineId === lineId
                ? { ...item, qty: clampQty(qty) }
                : item
            )
            .filter((item) => item.qty > 0),
        })),
      updateGram: (lineId, gram) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.lineId === lineId
              ? {
                  ...item,
                  selectedGram: clampGram(gram, item.baseGram || 100),
                }
              : item
          ),
        })),
      clearCart: () => set({ items: [] }),
      totalQuantity: () =>
        get().items.reduce((sum, item) => sum + item.qty, 0),
      totalAmount: () =>
        get().items.reduce(
          (sum, item) => sum + item.qty * calculateUnitPrice(item),
          0
        ),
      selectedRoast: (lineId: string) =>
        get().items.find((item) => item.lineId === lineId)
          ?.selectedRoast,
      selectedGram: (lineId: string) =>
        get().items.find((item) => item.lineId === lineId)
          ?.selectedGram,
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
