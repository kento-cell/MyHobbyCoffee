import { getBlog } from "@/lib/microcms";

export default async function BlogDetailPage({
  params,
}: {
  params: { id: string };
}) {
  //console.log("params:", params); // ← デバッグ

  const blog = await getBlog(params.id);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-500 mb-6">{blog.date}</p>

      <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
        {blog.body}
      </div>
    </div>
  );
}
