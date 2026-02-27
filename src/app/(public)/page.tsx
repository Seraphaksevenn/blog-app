import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import "@/models/Category";
import BlogCard from "@/components/blog/BlogCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await dbConnect();

  const recentPosts = await Post.find({ status: "published" })
    .populate("category", "name slug")
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  const serialized = JSON.parse(JSON.stringify(recentPosts));

  return (
    <main>
      {/* Hero */}
      <section className="bg-primary text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Merhaba, Ben Serap
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            Yazılım, teknoloji ve tasarım üzerine yazıyorum.
          </p>
          <Link
            href="/blog"
            className="inline-block bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Yazıları Keşfet
          </Link>
        </div>
      </section>

      {/* Son Yazılar */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Son Yazılar</h2>
          <Link
            href="/blog"
            className="text-primary hover:underline font-medium"
          >
            Tümünü Gör &rarr;
          </Link>
        </div>

        {serialized.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {serialized.map((post: Record<string, unknown>) => (
              <BlogCard key={String(post._id)} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-muted text-center py-12">
            Henüz yayınlanmış yazı bulunmuyor.
          </p>
        )}
      </section>
    </main>
  );
}
