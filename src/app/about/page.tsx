export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 pb-24 pt-12 space-y-10">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.22em] text-gray-500">
          About
        </p>
        <h1 className="text-3xl font-semibold text-[#1c1c1c]">
          Aurelbel Roasters について
        </h1>
        <p className="text-sm text-gray-700">
          LightUpCoffee の静かな世界観を参照しつつ、白とライムグリーンで構成したミニマルな EC
          サイトです。
        </p>
      </header>

      <section className="rounded-3xl bg-white/90 p-8 shadow-[0_18px_48px_rgba(0,0,0,0.06)]">
        <h2 className="text-2xl font-semibold text-[#1c1c1c]">コンセプト</h2>
        <p className="mt-4 text-base leading-relaxed text-gray-800">
          余白を大きく取り、写真を主役にしたシングルカラム中心のレイアウト。
          microCMS の既存スキーマを変えずに UI/UX だけを刷新し、Stripe への拡張性を確保しています。
          Next.js 16 + TypeScript + Tailwind CSS を使用し、レスポンシブで軽やかな体験を提供します。
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Brand Color",
            body: "メインカラー #A4DE02。白とグレーで余白を際立たせ、アクセントにライムグリーンを使用。",
          },
          {
            title: "Typography",
            body: "Noto Sans / Inter をベースに、細めのウェイトで軽やかな印象に。",
          },
          {
            title: "Architecture",
            body: "microCMS 連携・next/image・SEO メタデータ・404 ページなど基本要件を実装。",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-[#e6e6e6] bg-white p-6 shadow-[0_14px_36px_rgba(0,0,0,0.06)]"
          >
            <h3 className="text-xl font-semibold text-[#1c1c1c]">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-700">
              {item.body}
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}
