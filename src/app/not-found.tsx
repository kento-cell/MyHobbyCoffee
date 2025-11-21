import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="max-w-xl space-y-4 rounded-3xl bg-white p-8 text-center shadow-[0_18px_48px_rgba(0,0,0,0.06)]">
        <p className="text-xs uppercase tracking-[0.22em] text-gray-500">404</p>
        <h1 className="text-3xl font-semibold text-[#1c1c1c]">
          お探しのページが見つかりません
        </h1>
        <p className="text-sm text-gray-700">
          URL が正しいかご確認ください。トップページまたはメニューからお戻りいただけます。
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Link
            href="/"
            className="rounded-full border border-[#1f3b08] px-5 py-2 text-sm font-semibold text-[#1f3b08] transition hover:bg-[#1f3b08] hover:text-white"
          >
            Home
          </Link>
          <Link
            href="/menu"
            className="rounded-full bg-[#a4de02] px-5 py-2 text-sm font-semibold text-[#1f3b08] shadow-[0_12px_36px_rgba(164,222,2,0.45)] transition hover:-translate-y-[1px]"
          >
            Menu
          </Link>
        </div>
      </div>
    </main>
  );
}
