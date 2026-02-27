import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import "@/models/Category";
import { formatDate, calculateReadingTime } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  await dbConnect();
  const post = await Post.findOne({ slug, status: "published" }).lean();

  if (!post) {
    return { title: "Yazı Bulunamadı" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      ...(post.coverImage && { images: [{ url: post.coverImage }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      ...(post.coverImage && { images: [post.coverImage] }),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  await dbConnect();
  const post = await Post.findOne({ slug, status: "published" })
    .populate("category", "name slug")
    .lean();

  if (!post) {
    notFound();
  }

  const readingTime = calculateReadingTime(post.content);
  const category = post.category as { name: string; slug: string };

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-muted hover:text-primary transition-colors mb-8"
      >
        &larr; Tüm Yazılar
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-3 text-sm text-muted mb-4">
          <Link
            href={`/blog?kategori=${category?.slug}`}
            className="bg-accent px-3 py-1 rounded-full text-primary text-xs font-medium hover:underline"
          >
            {category?.name}
          </Link>
          <span>{formatDate(post.createdAt)}</span>
          <span>&middot;</span>
          <span>{readingTime} dk okuma</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
          {post.title}
        </h1>

        <p className="text-lg text-muted">{post.excerpt}</p>
      </header>

      {post.coverImage ? (
        <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden mb-10">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      ) : (
        <div className="h-64 md:h-80 bg-muted/20 rounded-xl flex items-center justify-center text-muted text-sm mb-10">
          Kapak Görseli
        </div>
      )}

      <article className="prose prose-lg max-w-none">
        <ReactMarkdown
          components={{
            h2: ({ children }) => (
              <h2 className="text-2xl font-bold mt-10 mb-4">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-semibold mt-8 mb-3">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="text-foreground/85 leading-relaxed mb-4">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-6 mb-4 space-y-1 text-foreground/85">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-6 mb-4 space-y-1 text-foreground/85">
                {children}
              </ol>
            ),
            code: ({ children, className }) => {
              const isBlock = className?.includes("language-");
              if (isBlock) {
                return (
                  <code className="block bg-card border border-card-border rounded-lg p-4 overflow-x-auto text-sm my-4 font-mono">
                    {children}
                  </code>
                );
              }
              return (
                <code className="bg-accent px-1.5 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              );
            },
            pre: ({ children }) => <pre className="not-prose">{children}</pre>,
            strong: ({ children }) => (
              <strong className="font-semibold text-foreground">
                {children}
              </strong>
            ),
          }}
        >
          {post.content}
        </ReactMarkdown>
      </article>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-card-border">
          {post.tags.map((tag: string) => (
            <span
              key={tag}
              className="text-sm bg-accent text-primary px-3 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </main>
  );
}
