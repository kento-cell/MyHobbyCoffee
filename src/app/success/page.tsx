import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-16 text-center">
      <div className="rounded-3xl bg-white/90 p-8 shadow-lg">
        <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Thank you</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#1c1c1c]">決済が完了しました</h1>
        <p className="mt-3 text-sm text-gray-700">
          ご購入ありがとうございました。決済が正常に完了しました。
          ブラウザを閉じてもこのページからホームやメニューに戻れます。
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-[#a4de02] px-5 py-3 text-sm font-semibold text-[#0f1c0a] shadow-[0_12px_32px_rgba(164,222,2,0.45)] transition hover:-translate-y-[1px]"
          >
            Homeへ戻る
          </Link>
          <Link
            href="/menu"
            className="rounded-full border border-[#dcdcdc] px-5 py-3 text-sm font-semibold text-[#1f3b08] transition hover:-translate-y-[1px] hover:bg-white"
          >
            Menuを見る
          </Link>
        </div>
      </div>
    </main>
  );
}
