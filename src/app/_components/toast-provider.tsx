'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";

type Toast = {
  id: number;
  message: string;
};

type ToastContextValue = {
  pushToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const isClient = typeof window !== "undefined";

  const pushToast = useCallback((message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2600);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {isClient &&
        createPortal(
          <div className="pointer-events-none fixed bottom-6 left-1/2 z-[120] w-full max-w-md -translate-x-1/2 space-y-2 px-4">
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className="pointer-events-auto flex items-center justify-between gap-3 rounded-2xl bg-[#0f1c0a] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_44px_rgba(0,0,0,0.18)]"
              >
                <span>{toast.message}</span>
                <button
                  type="button"
                  className="text-xs text-white/70 transition hover:text-white"
                  onClick={() => removeToast(toast.id)}
                  aria-label="close toast"
                >
                  ×
                </button>
              </div>
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
};
