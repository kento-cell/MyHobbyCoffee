'use client';

import { useMemo } from "react";

type QtySelectorProps = {
  value: number;
  onChange: (qty: number) => void;
  min?: number;
  max?: number;
  compact?: boolean;
};

export const QtySelector = ({
  value,
  onChange,
  min = 1,
  max = 10,
  compact,
}: QtySelectorProps) => {
  const clampedValue = useMemo(
    () => Math.max(min, Math.min(max, value)),
    [value, min, max]
  );

  const handleChange = (next: number) => {
    const qty = Math.max(min, Math.min(max, next));
    onChange(qty);
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border ${
        compact ? "px-2" : "px-3"
      } py-1.5 text-sm font-semibold ${
        compact ? "gap-1.5" : "gap-2.5"
      } border-[#dcdcdc] bg-white shadow-sm`}
    >
      <button
        type="button"
        onClick={() => handleChange(clampedValue - 1)}
        disabled={clampedValue <= min}
        className="h-7 w-7 rounded-full bg-[#f5f5f5] text-[#1f3b08] transition hover:bg-[#ecf6d6] disabled:cursor-not-allowed disabled:opacity-60"
        aria-label="decrease quantity"
      >
        -
      </button>
      <span className="min-w-[1.5rem] text-center text-base">
        {clampedValue}
      </span>
      <button
        type="button"
        onClick={() => handleChange(clampedValue + 1)}
        disabled={clampedValue >= max}
        className="h-7 w-7 rounded-full bg-[#a4de02] text-[#0f1c0a] transition hover:-translate-y-[1px] hover:shadow-[0_10px_24px_rgba(164,222,2,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
        aria-label="increase quantity"
      >
        +
      </button>
    </div>
  );
};
