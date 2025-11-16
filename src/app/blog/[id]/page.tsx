import { getBlog } from "@/lib/microcms";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const blog = await getBlog(id);
  console.log("BLOG DATA:", JSON.stringify(blog, null, 2));

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* タイトル */}
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>

      {/* 日付（あれば） */}
      {blog.date && <p className="text-gray-500 mb-6">{blog.date}</p>}

      {/* アイキャッチ */}
      {blog.eyecatch?.url && (
        <img
          src={blog.eyecatch.url}
          alt="eyecatch"
          className="w-full rounded-lg mb-6"
        />
      )}

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
}
