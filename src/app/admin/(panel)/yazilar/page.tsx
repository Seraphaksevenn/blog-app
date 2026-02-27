import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import "@/models/Category";
import { formatDate } from "@/lib/utils";
import DeletePostButton from "@/components/admin/DeletePostButton";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  await dbConnect();

  const posts = await Post.find()
    .populate("category", "name slug")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Yazılar</h1>
        <Link
          href="/admin/yazilar/yeni"
          className="bg-primary text-white font-medium px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors text-sm"
        >
          + Yeni Yazı
        </Link>
      </div>

      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border text-left text-muted">
                <th className="px-5 py-3 font-medium">Başlık</th>
                <th className="px-5 py-3 font-medium">Kategori</th>
                <th className="px-5 py-3 font-medium">Durum</th>
                <th className="px-5 py-3 font-medium">Tarih</th>
                <th className="px-5 py-3 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={String(post._id)}
                  className="border-b border-card-border last:border-0 hover:bg-background/50"
                >
                  <td className="px-5 py-3">
                    <div>
                      <p className="font-medium">{post.title}</p>
                      <p className="text-xs text-muted mt-0.5">
                        /{post.slug}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted">
                    {(post.category as { name: string })?.name || "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        post.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {post.status === "published" ? "Yayında" : "Taslak"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/yazilar/${post._id}/duzenle`}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-card-border hover:border-primary hover:text-primary transition-colors"
                      >
                        Düzenle
                      </Link>
                      <DeletePostButton postId={String(post._id)} />
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-muted">
                    Henüz yazı bulunmuyor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
