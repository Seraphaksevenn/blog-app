import Link from "next/link";
import Image from "next/image";
import { formatDate, calculateReadingTime } from "@/lib/utils";

interface PostData {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  category: { name: string; slug: string };
  tags: string[];
  createdAt: string;
}

interface BlogCardProps {
  post: PostData | Record<string, unknown>;
  showTags?: boolean;
}

export default function BlogCard({ post, showTags = false }: BlogCardProps) {
  const p = post as PostData;
  const category = p.category || { name: "—", slug: "" };

  return (
    <article className="bg-card border border-card-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
      {p.coverImage ? (
        <div className="relative h-48 w-full">
          <Image
            src={p.coverImage}
            alt={p.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="h-48 bg-muted/20 flex items-center justify-center text-muted text-sm">
          Kapak Görseli
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center gap-2 text-sm text-muted mb-2">
          <Link
            href={`/blog?kategori=${category.slug}`}
            className="bg-accent px-2 py-0.5 rounded text-primary text-xs font-medium hover:underline"
          >
            {category.name}
          </Link>
          <span>{formatDate(p.createdAt)}</span>
          <span>&middot;</span>
          <span>{calculateReadingTime(p.content)} dk okuma</span>
        </div>

        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
          <Link
            href={`/blog/${p.slug}`}
            className="hover:text-primary transition-colors"
          >
            {p.title}
          </Link>
        </h3>

        <p className="text-muted text-sm line-clamp-3">{p.excerpt}</p>

        {showTags && p.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {p.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-xs bg-background px-2 py-1 rounded text-muted"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {!showTags && (
          <div className="mt-4 flex items-center justify-between text-sm text-muted">
            <span>{calculateReadingTime(p.content)} dk okuma</span>
            <Link
              href={`/blog/${p.slug}`}
              className="text-primary hover:underline font-medium"
            >
              Devamını Oku
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
