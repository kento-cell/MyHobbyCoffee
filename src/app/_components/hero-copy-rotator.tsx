'use client';

import { useEffect, useMemo, useState } from "react";

type HeroCopyRotatorProps = {
  messages: string[];
  intervalMs?: number;
};

export const HeroCopyRotator = ({
  messages,
  intervalMs = 5000,
}: HeroCopyRotatorProps) => {
  const list = useMemo(
    () => messages.filter((msg) => Boolean(msg?.trim())),
    [messages]
  );
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (list.length <= 1) return;
    let timeoutId: number | null = null;
    const id = window.setInterval(() => {
      setVisible(false);
      timeoutId = window.setTimeout(() => {
        setIndex((prev) => ((prev + 1) % list.length + list.length) % list.length);
        setVisible(true);
      }, 250);
    }, intervalMs);
    return () => {
      window.clearInterval(id);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [list.length, intervalMs]);

  if (list.length === 0) return null;
  return (
    <span
      className={`inline-block transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {list[index]}
    </span>
  );
};
