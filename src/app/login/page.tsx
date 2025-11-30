'use client';

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.replace("/admin");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-lg"
      >
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-[#1c1c1c]">ログイン</h1>
          <p className="text-sm text-gray-600">メールとパスワードでサインイン</p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#1c1c1c]">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#e2e2e2] px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="block text-sm font-semibold text-[#1c1c1c]">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#e2e2e2] px-3 py-2 text-sm"
              required
            />
          </label>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#1f3b08] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-[1px] hover:shadow-md disabled:opacity-60"
        >
          {loading ? "ログイン中..." : "ログイン"}
        </button>
      </form>
    </main>
  );
}
