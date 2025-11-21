import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlog } from "@/lib/microcms";

export const revalidate = 120;

const fetchBlog = async (id: string) => {
  try {
    return await getBlog(id);
  } catch {
    return null;
  }
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const blog = await fetchBlog(params.id);
  if (!blog) {
    return { title: "記事が見つかりません | MyHobbyCoffee" };
  }

  return {
    title: `${blog.title} | MyHobbyCoffee`,
    description: blog.content
      ? blog.content.replace(/<[^>]+>/g, "").slice(0, 120)
      : "スペシャルティコーヒーのブログ記事",
    openGraph: {
      title: blog.title,
      description: blog.content
        ? blog.content.replace(/<[^>]+>/g, "").slice(0, 120)
        : "",
      images: blog.eyecatch?.url ? [{ url: blog.eyecatch.url }] : undefined,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const blog = await fetchBlog(params.id);

  if (!blog) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-12">
      <Link
        href="/blog"
        className="text-sm font-semibold text-[#1f3b08] underline-offset-4 hover:underline"
      >
        ← ブログ一覧へ
      </Link>

      <article className="mt-6 space-y-6">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.22em] text-gray-500">
            Journal
          </p>
          <h1 className="text-3xl font-semibold text-[#1c1c1c]">
            {blog.title}
          </h1>
          {blog.date && (
            <p className="text-sm text-gray-600">公開日: {blog.date}</p>
          )}
          {blog.category?.name && (
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f5f9eb] px-3 py-1 text-xs font-semibold text-[#3f5c1f]">
              {blog.category.name}
            </span>
          )}
        </header>

        {blog.eyecatch?.url && (
          <div className="relative h-72 w-full overflow-hidden rounded-2xl">
            <Image
              src={blog.eyecatch.url}
              alt="eyecatch"
              fill
              sizes="(max-width: 768px) 100vw, 740px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div
          className="space-y-4 leading-relaxed text-gray-800 [&_h2]:mt-8 [&_h2]:text-2xl [&_h3]:mt-6 [&_h3]:text-xl [&_img]:rounded-2xl [&_a]:text-[#1f3b08] [&_a]:underline-offset-4"
          dangerouslySetInnerHTML={{ __html: blog.content || "" }}
        />
      </article>
    </main>
  );
}
