import Link from "next/link";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import "@/models/Category";
import PostForm from "@/components/admin/PostForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await dbConnect();
  const post = await Post.findById(id)
    .populate("category", "_id name slug")
    .lean();

  if (!post) {
    notFound();
  }

  // lean() sonucu serializable hale getir
  const serialized = JSON.parse(JSON.stringify(post));

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/yazilar"
          className="text-muted hover:text-foreground transition-colors"
        >
          &larr;
        </Link>
        <h1 className="text-2xl font-bold">Yazı Düzenle</h1>
      </div>

      <PostForm initialData={serialized} />
    </div>
  );
}
