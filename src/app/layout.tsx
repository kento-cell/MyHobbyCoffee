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
          <header className="fixed left-0 top-0 z-50 w-full border-b border-white/70 bg-white/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <Link href="/" className="group flex items-center gap-4">
                <Image
                  src="/Logo.png"
                  alt="Aurelbel Roastery Logo"
                  width={80}
                  height={80}
                  className="h-20 w-20 object-contain transition duration-300 group-hover:-translate-y-[2px]"
                  priority
                />
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] uppercase tracking-[0.32em] text-gray-500">
                    Specialty
                  </span>
                  <span className="text-2xl font-semibold tracking-tight text-[#1c1c1c]">
                    Aurelbel Roastery
                  </span>
                </div>
              </Link>

              <nav className="flex items-center gap-6 text-sm font-medium">
                <Link
                  href="/"
                  className="transition hover:text-[#1f3b08]"
                  prefetch
                >
                  Home
                </Link>
                <Link
                  href="/menu"
                  className="transition hover:text-[#1f3b08]"
                  prefetch
                >
                  Menu
                </Link>
                <Link
                  href="/about"
                  className="transition hover:text-[#1f3b08]"
                  prefetch
                >
                  About
                </Link>
                <CartIcon />
              </nav>
            </div>
          </header>

          <div className="h-24" />
          {children}

          <footer className="mt-24 border-t border-[#e6e6e6] bg-white/90">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Image
                    src="/Logo.png"
                    alt="Aurelbel Roastery Logo"
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-lg object-contain"
                  />
                  <span className="text-lg font-semibold text-[#1c1c1c]">
                    Aurelbel Roastery
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  余白を活かしたミニマルな UI で、豆の個性を静かに伝えます。
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-[#1f3b08]">
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
                <a
                  href="https://www.youtube.com"
                  className="hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  YouTube
                </a>
              </div>
            </div>
            <div className="border-t border-[#e6e6e6] bg-white/60 py-4 text-center text-xs text-gray-500">
              © 2025 Aurelbel Roastery. All rights reserved.
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
