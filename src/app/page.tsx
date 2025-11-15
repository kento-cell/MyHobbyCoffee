import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full">
        <Image
          src="/sample1.jpg" // ← public/sample1.jpg を使う
          alt="Coffee Beans"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="absolute bottom-20 left-10 text-white drop-shadow-lg">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            趣味でコーヒー屋はじめてみました・・・
          </h1>
          <p className="text-lg">
            こだわりのスペシャルティコーヒーを、あなたへ。
          </p>

          <Link
            href="/menu"
            className="inline-block mt-6 px-6 py-3 bg-white text-black font-semibold rounded-lg shadow hover:bg-neutral-200 transition"
          >
            コーヒー豆を見る
          </Link>
        </div>
      </section>

      {/* Recommended Beans */}
      <section className="max-w-6xl mx-auto mt-24 px-4">
        <h2 className="text-3xl font-bold mb-6">おすすめの豆</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              name: "エチオピア イルガチェフェ",
              price: 1080,
              image: "/sample1.jpg",
            },
            {
              name: "ケニア キリニャガ",
              price: 1200,
              image: "/sample2.jpg",
            },
            {
              name: "コロンビア ウィラ",
              price: 980,
              image: "/sample3.jpg",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="border rounded-xl p-4 shadow-sm hover:shadow-xl transition bg-white"
            >
              <Image
                src={item.image}
                alt={item.name}
                width={600}
                height={400}
                className="rounded-lg"
              />
              <h3 className="font-bold text-xl mt-4">{item.name}</h3>
              <p className="text-gray-600 mt-1">¥{item.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-6xl mx-auto mt-32 px-4 flex flex-col md:flex-row items-center gap-10">
        <Image
          src="/sample2.jpg"
          alt="About"
          width={500}
          height={350}
          className="rounded-xl shadow"
        />

        <div>
          <h2 className="text-3xl font-bold mb-4">私たちについて</h2>
          <p className="text-gray-700 leading-relaxed">
            高品質なスペシャルティコーヒーの魅力をもっと身近に。
            生産者の想いを届け、豆の個性を最大限に活かす焙煎を心がけています。
          </p>

          <Link
            href="/about"
            className="inline-block mt-6 px-6 py-3 border border-black rounded-lg hover:bg-black hover:text-white transition"
          >
            Read More →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-32 py-10 text-center text-gray-500">
        © 2025 MyCoffee – All Rights Reserved.
      </footer>
    </main>
  );
}
