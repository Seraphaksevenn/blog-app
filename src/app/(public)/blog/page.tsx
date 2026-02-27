import type { Metadata } from "next";
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import Category from "@/models/Category";
import BlogCard from "@/components/blog/BlogCard";
import Pagination from "@/components/ui/Pagination";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog Yazıları",
  description: "Yazılım, teknoloji ve tasarım üzerine tüm blog yazıları.",
};

const POSTS_PER_PAGE = 4;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; sayfa?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.kategori || "";
  const currentPage = Number(params.sayfa) || 1;

  await dbConnect();

  const categories = await Category.find().sort({ name: 1 }).lean();

  // Filtre oluştur
  const filter: Record<string, unknown> = { status: "published" };
  if (activeCategory) {
    const cat = categories.find((c) => c.slug === activeCategory);
    if (cat) filter.category = cat._id;
  }

  const total = await Post.countDocuments(filter);
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  const posts = await Post.find(filter)
    .populate("category", "name slug")
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * POSTS_PER_PAGE)
    .limit(POSTS_PER_PAGE)
    .lean();

  const serializedPosts = JSON.parse(JSON.stringify(posts));
  const serializedCategories = JSON.parse(JSON.stringify(categories));

  const baseHref = activeCategory
    ? `/blog?kategori=${activeCategory}`
    : "/blog";

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Blog Yazıları</h1>

      {/* Kategori Filtresi */}
      <div className="flex flex-wrap gap-2 mb-10">
        <Link
          href="/blog"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !activeCategory
              ? "bg-primary text-white"
              : "bg-card border border-card-border text-foreground hover:border-primary"
          }`}
        >
          Tümü
        </Link>
        {serializedCategories.map(
          (cat: { _id: string; name: string; slug: string }) => (
            <Link
              key={cat._id}
              href={`/blog?kategori=${cat.slug}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.slug
                  ? "bg-primary text-white"
                  : "bg-card border border-card-border text-foreground hover:border-primary"
              }`}
            >
              {cat.name}
            </Link>
          )
        )}
      </div>

      {/* Yazı Listesi */}
      {serializedPosts.length === 0 ? (
        <p className="text-muted text-center py-12">
          {activeCategory
            ? "Bu kategoride henüz yazı bulunmuyor."
            : "Henüz yayınlanmış yazı bulunmuyor."}
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {serializedPosts.map((post: Record<string, unknown>) => (
            <BlogCard key={String(post._id)} post={post} showTags />
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        baseHref={baseHref}
      />
    </main>
  );
}
