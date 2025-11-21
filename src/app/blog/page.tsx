import { BlogCard } from "../_components/cards";
import { getBlogs } from "@/lib/microcms";

export default async function BlogPage() {
  const { contents } = await getBlogs();

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-12">
      <header className="mb-10 flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.22em] text-gray-500">
          Blog
        </p>
        <h1 className="text-3xl font-semibold text-[#1c1c1c]">コーヒージャーナル</h1>
        <p className="text-sm text-gray-700">
          産地や焙煎ノート、ペアリングの小話などを静かなレイアウトでまとめています。
        </p>
      </header>

      <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {contents.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </section>
    </main>
  );
}
