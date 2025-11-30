export default function AdminPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="rounded-2xl bg-white p-8 shadow-md">
        <p className="text-sm uppercase tracking-[0.18em] text-gray-500">
          Admin
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-[#1c1c1c]">
          ログイン成功
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          管理画面トップです。ここにダッシュボードや設定を追加できます。
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <a
            href="/admin/inventory"
            className="rounded-xl border border-[#e8e8e8] bg-[#f7fbf1] px-4 py-3 text-sm font-semibold text-[#1f3b08] shadow-sm transition hover:-translate-y-[1px] hover:shadow-md"
          >
            在庫管理へ
          </a>
          <span className="rounded-xl border border-[#e8e8e8] bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
            （注文一覧・詳細は未実装）
          </span>
        </div>
      </div>
    </main>
  );
}
