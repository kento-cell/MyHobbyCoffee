"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getRecommendedMenu } from "@/lib/microcms";

export default function Home() {
  const messages = [
    "趣味でコーヒー屋はじめてみました・・・",
    "こだわりの一杯から、あなたの一日が始まる。",
    "焙煎の香りとともに、心地よい時間を。",
    "豆の個性を楽しむ、小さなコーヒー屋です。",
  ];

  const [title, setTitle] = useState("");
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    setTitle(messages[Math.floor(Math.random() * messages.length)]);

    const fetchData = async () => {
      const data = await getRecommendedMenu();
      setRecommended(data.contents);
    };
    fetchData();
  }, []);

  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <video
          src="/SampleMov_home.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="absolute bottom-20 left-10 text-white drop-shadow-lg">
          <h1 className="text-5xl font-bold mb-4 tracking-tight opacity-0 animate-fade-slide">
            {title}
          </h1>

          <p className="text-lg opacity-0 animate-fade-slide delay-300">
            こだわりのスペシャルティコーヒーを、あなたへ。
          </p>

          <Link
            href="/menu"
            className="inline-block mt-6 px-6 py-3 bg-white text-black font-semibold rounded-lg shadow hover:bg-neutral-200 transition opacity-0 animate-fade-slide delay-500"
          >
            コーヒー豆を見る
          </Link>
        </div>
      </section>

      {/* Recommended Beans */}
      <section className="max-w-6xl mx-auto mt-24 px-4">
        <h2 className="text-3xl font-bold mb-6">おすすめの豆</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {recommended.length === 0 && (
            <p className="text-gray-500">おすすめの豆を準備中です…</p>
          )}

          {recommended.map((item) => (
            <Link
              key={item.id}
              href={`/menu/${item.id}`}
              className="border rounded-xl p-4 shadow-sm hover:shadow-xl transition bg-white block cursor-pointer"
            >
              <Image
                src={item.image?.url || "/no_image.jpg"}
                alt={item.name}
                width={600}
                height={400}
                className="rounded-lg mb-3 object-cover h-48 w-full"
              />

              <h3 className="font-bold text-xl">{item.name}</h3>

              <p className="text-gray-600 mt-1">
                {Array.isArray(item.roast)
                  ? item.roast.join(" / ")
                  : item.roast}
              </p>

              <p className="text-gray-800 mt-1 font-semibold">¥{item.price}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-6xl mx-auto mt-32 px-4 flex flex-col md:flex-row items-center gap-10">
        <img
          src="/sample2.jpg"
          alt="About"
          className="rounded-xl shadow w-[500px] h-auto"
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

      <footer className="mt-32 py-10 text-center text-gray-500">
        © 2025 MyHobbyCoffee – All Rights Reserved.
      </footer>
    </main>
  );
}
