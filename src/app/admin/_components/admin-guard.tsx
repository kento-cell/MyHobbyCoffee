'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

const adminEmailAllowlist = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
  .split(",")
  .map((v) => v.trim().toLowerCase())
  .filter(Boolean);

export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      const user = data.session?.user;
      const role = user?.app_metadata?.role;
      const email = user?.email?.toLowerCase();
      const isAllowlisted = email ? adminEmailAllowlist.includes(email) : false;
      if (!data.session) {
        router.replace("/login");
      } else if (role !== "admin" && !isAllowlisted) {
        router.replace("/");
      } else {
        setChecking(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [router, supabase]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f7f7] text-sm text-gray-600">
        認証を確認しています…
      </div>
    );
  }

  return <>{children}</>;
};
