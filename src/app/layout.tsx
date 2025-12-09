import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { CartIcon } from "./_components/cart-icon";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aurelbel Roastery | Light Up Your Daily Cup",
  description:
    "余白を活かしたミニマルなデザインで、産地の個性が際立つスペシャルティコーヒーを届けます。",
  openGraph: {
    title: "Aurelbel Roastery | Light Up Your Daily Cup",
    description:
      "産地と焙煎にこだわった一杯を、シンプルで美しいUIからお届けします。",
    url: "https://myhobbycoffee.com",
    siteName: "Aurelbel Roastery",
    images: [{ url: "/Logo.png" }],
  },
  icons: {
    icon: ["/favicon.ico", { url: "/icon.png", sizes: "512x512", type: "image/png" }],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body
        className={`${inter.variable} ${notoSansJp.variable} bg-[#f5f5f5] text-[#222222] antialiased`}
      >
        <Providers>
          <header className="fixed left-0 top-0 z-50 w-full border-b border-[#8fca00] bg-[#a4de02] text-[#0f1c0a] shadow-sm">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
              <Link href="/" className="group flex items-center gap-3 sm:gap-4 text-[#0f1c0a]">
                <Image
                  src="/Logo.png"
                  alt="Aurelbel Roastery Logo"
                  width={96}
                  height={96}
                  className="h-16 w-16 object-contain transition duration-300 group-hover:-translate-y-[2px] sm:h-20 sm:w-20 md:h-24 md:w-24"
                  priority
                />
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] uppercase tracking-[0.32em] text-[#0b1c0a]/80">
                    Specialty
                  </span>
                  <span className="text-xl font-semibold tracking-tight text-[#0f1c0a] sm:text-2xl">
                    Aurelbel Roastery
                  </span>
                </div>
              </Link>

              <nav className="flex w-full flex-wrap items-center gap-3 text-sm font-medium sm:w-auto sm:justify-end sm:gap-5">
                <Link
                  href="/"
                  className="transition hover:text-[#0b1507]"
                  prefetch
                >
                  Home
                </Link>
                <Link
                  href="/menu"
                  className="transition hover:text-[#0b1507]"
                  prefetch
                >
                  Menu
                </Link>
                <Link
                  href="/about"
                  className="transition hover:text-[#0b1507]"
                  prefetch
                >
                  About
                </Link>
                <Link
                  href="/recommender/start"
                  className="transition hover:text-[#0b1507]"
                  prefetch
                >
                  AI診断
                </Link>
                <CartIcon />
              </nav>
            </div>
          </header>

          <div className="h-24" />
          {children}

          <footer className="mt-24 border-t border-[#8fca00] bg-[#a4de02] text-[#0f1c0a]">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Image
                    src="/Logo.png"
                    alt="Aurelbel Roastery Logo"
                    width={64}
                    height={64}
                    className="h-14 w-14 rounded-lg object-contain md:h-16 md:w-16"
                  />
                  <span className="text-lg font-semibold text-[#0f1c0a]">
                    Aurelbel Roastery
                  </span>
                </div>
                <p className="text-sm text-[#0b1c0a]/80">
                  余白を活かしたミニマルな UI で、豆の個性を静かに伝えます。
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-[#0b1507]">
                <Link href="/menu" className="hover:underline" prefetch>
                  Menu
                </Link>
                <Link href="/about" className="hover:underline" prefetch>
                  About
                </Link>
                <a
                  href="https://www.instagram.com"
                  className="hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              </div>
            </div>
            <div className="border-t border-[#8fca00] bg-[#96c800] py-4 text-center text-xs text-[#0b1c0a]/80">
              (c) 2025 Aurelbel Roastery. All rights reserved.
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
