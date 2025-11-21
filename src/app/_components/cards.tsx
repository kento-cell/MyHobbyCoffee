import Image from "next/image";
import Link from "next/link";
import { BlogEntry, MenuItem, getImageUrl } from "@/lib/microcms";

type ProductCardProps = {
  item: MenuItem;
  href?: string;
};

export const ProductCard = ({ item, href }: ProductCardProps) => {
  const content = (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
      <div className="relative h-52 w-full overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-1 bg-[#a4de02]" />
        <Image
          src={getImageUrl(item.image?.url)}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, 380px"
          className="object-cover transition duration-500 group-hover:scale-105"
          priority={false}
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 pb-6 pt-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-gray-500">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#f5f9eb] px-3 py-1 text-[11px] text-[#3f5c1f]">
            Light roast craft
          </span>
          {item.roast && (
            <span className="text-gray-600">
              {Array.isArray(item.roast) ? item.roast.join(" / ") : item.roast}
            </span>
          )}
        </div>

        <h3 className="text-xl font-semibold tracking-tight text-[#222222]">
          {item.name}
        </h3>

        {item.origin && (
          <p className="text-sm text-gray-600">Origin: {item.origin}</p>
        )}

        {item.description && (
          <p className="line-clamp-3 text-sm leading-relaxed text-gray-700">
            {item.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="text-lg font-semibold text-[#1f3b08]">
            {typeof item.price === "number"
              ? `¥${item.price.toLocaleString()}`
              : "価格はお問い合わせください"}
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-gray-500">
            View detail
          </span>
        </div>
      </div>
    </article>
  );

  if (!href) {
    return content;
  }

  return (
    <Link
      href={href}
      className="block h-full focus:outline-none focus:ring-2 focus:ring-[#a4de02] focus:ring-offset-4 focus:ring-offset-white"
    >
      {content}
    </Link>
  );
};

type BlogCardProps = {
  blog: BlogEntry;
};

export const BlogCard = ({ blog }: BlogCardProps) => {
  return (
    <Link
      href={`/blog/${blog.id}`}
      className="group flex h-full flex-col gap-3 rounded-2xl border border-[#e8e8e8] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] focus:outline-none focus:ring-2 focus:ring-[#a4de02] focus:ring-offset-4 focus:ring-offset-white"
    >
      {blog.eyecatch?.url && (
        <div className="relative h-44 w-full overflow-hidden rounded-xl">
          <Image
            src={blog.eyecatch.url}
            alt={blog.title}
            fill
            sizes="(max-width: 768px) 100vw, 360px"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex items-center gap-2 text-[13px] uppercase tracking-[0.14em] text-gray-500">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#f5f9eb] px-3 py-1 text-[11px] text-[#3f5c1f]">
          Coffee journal
        </span>
        {blog.date && <span>{blog.date}</span>}
      </div>

      <h3 className="text-xl font-semibold leading-tight text-[#1c1c1c]">
        {blog.title}
      </h3>

      <p className="text-sm text-gray-600">
        {blog.category?.name ? `Category: ${blog.category.name}` : "Story"}
      </p>

      <span className="mt-auto text-[13px] font-medium text-[#1f3b08] underline-offset-4 group-hover:underline">
        Read article
      </span>
    </Link>
  );
};
