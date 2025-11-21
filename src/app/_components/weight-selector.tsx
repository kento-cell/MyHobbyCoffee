'use client';

import { useState } from "react";

const options = [
  { label: "100g", value: "100g" },
  { label: "200g", value: "200g" },
];

type WeightSelectorProps = {
  onSelect?: (value: string) => void;
};

export const WeightSelector = ({ onSelect }: WeightSelectorProps) => {
  const [active, setActive] = useState(options[0].value);

  const handleChange = (value: string) => {
    setActive(value);
    onSelect?.(value);
  };

  return (
    <div className="flex gap-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => handleChange(option.value)}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            active === option.value
              ? "border-[#a4de02] bg-[#f2f9e3] text-[#1f3b08] shadow-sm"
              : "border-gray-200 bg-white text-gray-700 hover:border-[#a4de02]"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
