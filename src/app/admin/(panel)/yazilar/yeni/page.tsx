import Link from "next/link";
import PostForm from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/yazilar"
          className="text-muted hover:text-foreground transition-colors"
        >
          &larr;
        </Link>
        <h1 className="text-2xl font-bold">Yeni Yazı</h1>
      </div>

      <PostForm />
    </div>
  );
}
