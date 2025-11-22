'use client';

import { ToastProvider } from "./_components/toast-provider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <ToastProvider>{children}</ToastProvider>;
};
