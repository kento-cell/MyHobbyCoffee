import { client } from "@/lib/microcms";
import Link from "next/link";

//ログ出力用
console.log("DOMAIN:", process.env.MICROCMS_SERVICE_DOMAIN);
console.log("API KEY:", process.env.MICROCMS_API_KEY ? "OK" : "MISSING");

export default async function MenuPage() {
  const data = await client.getList({ endpoint: "menu" });

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">コーヒー豆一覧</h1>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.contents.map((item: any) => (
          <Link
            key={item.id}
            href={`/menu/${item.id}`}
            className="p-4 border rounded-lg block hover:shadow-xl transition cursor-pointer bg-white"
          >
            {/* 画像は表示する */}
            <img
              src={item.image?.url}
              alt={item.name}
              className="rounded-lg mb-3 w-full h-auto"
            />

            {/* 必要最小限の情報 */}
            <h2 className="text-xl font-semibold">{item.name}</h2>

            <p className="text-gray-600 mt-1">{item.roast}</p>

            <p className="font-bold mt-2">¥{item.price}</p>
          </Link>
        ))}
      </ul>
    </main>
  );
}
