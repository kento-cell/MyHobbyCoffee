import Link from "next/link";
import { getBlogs } from "@/lib/microcms";

export default async function BlogPage() {
  const { contents } = await getBlogs();

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>

      <div className="space-y-6">
        {contents.map((blog: any) => (
          <Link
            key={blog.id}
            href={`/blog/${blog.id}`} // ← ★これが必須
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold">{blog.title}</h2>
            <p className="text-gray-600 mt-2">{blog.date}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
