import "./globals.css";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "MyHobbyCoffee",
  description: "Coffee EC Site",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-white text-black">
        {/* Header */}
        <header className="w-full border-b bg-white/80 backdrop-blur-sm fixed top-0 left-0 z-50">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/coffeeFree.svg"
                alt="MyHobbyCoffee Logo"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-xl font-bold tracking-tight">
                MyHobbyCoffee
              </span>
            </Link>

            {/* Navigation */}
            <nav className="flex gap-6 text-sm font-medium">
              <Link href="/" className="hover:text-gray-500 transition">
                Home
              </Link>
              <Link href="/menu" className="hover:text-gray-500 transition">
                Menu
              </Link>
              <Link href="/about" className="hover:text-gray-500 transition">
                About
              </Link>
              <Link href="/blog" className="hover:text-gray-500 transition">
                Blog
              </Link>
            </nav>
          </div>
        </header>

        {/* Header の高さ分スペースを確保 */}
        <div className="h-16"></div>

        {children}
      </body>
    </html>
  );
}
