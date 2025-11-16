import Image from "next/image";
import { notFound } from "next/navigation";
import { client } from "@/lib/microcms";

export default async function MenuDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  let data;
  try {
    data = await client.get({
      endpoint: "menu",
      contentId: id,
    });
  } catch (e) {
    return notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      {/* 商品画像（代替画像対応） */}
      <Image
        src={data.image?.url || "/no_image.jpg"}
        alt={data.name}
        width={800}
        height={500}
        className="w-full h-64 object-cover rounded-xl shadow mb-8"
      />

      <h1 className="text-3xl font-bold">{data.name}</h1>

      {/* 情報ボックス */}
      <div className="mt-6 p-5 bg-white border border-gray-200 rounded-xl shadow-sm space-y-2">
        {data.origin && <p className="text-gray-700">産地：{data.origin}</p>}
        {data.roast && <p className="text-gray-700">焙煎度：{data.roast}</p>}
      </div>

      {/* 価格ボックス */}
      <div className="mt-6 p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
        <p className="text-2xl font-bold text-black">¥{data.price}</p>
      </div>

      {/* 説明文ボックス */}
      {data.description && (
        <div className="mt-6 p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
          <p className="leading-relaxed text-gray-700 whitespace-pre-line">
            {data.description}
          </p>
        </div>
      )}

      <a
        href="/menu"
        className="inline-block mt-12 px-6 py-3 border border-black rounded-lg hover:bg-black hover:text-white transition"
      >
        ← 商品一覧へ戻る
      </a>
    </main>
  );
}
