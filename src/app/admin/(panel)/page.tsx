import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import Category from "@/models/Category";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await dbConnect();

  const [totalPosts, publishedPosts, draftPosts, totalCategories, recentPosts] =
    await Promise.all([
      Post.countDocuments(),
      Post.countDocuments({ status: "published" }),
      Post.countDocuments({ status: "draft" }),
      Category.countDocuments(),
      Post.find()
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

  const stats = [
    { label: "Toplam Yazı", value: totalPosts, color: "text-primary" },
    { label: "Yayında", value: publishedPosts, color: "text-green-600" },
    { label: "Taslak", value: draftPosts, color: "text-yellow-600" },
    { label: "Kategori", value: totalCategories, color: "text-purple-600" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-card-border rounded-xl p-5"
          >
            <p className="text-sm text-muted mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-card-border rounded-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-card-border">
          <h2 className="font-semibold">Son Yazılar</h2>
          <Link
            href="/admin/yazilar"
            className="text-sm text-primary hover:underline"
          >
            Tümünü Gör
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border text-left text-muted">
                <th className="px-5 py-3 font-medium">Başlık</th>
                <th className="px-5 py-3 font-medium">Kategori</th>
                <th className="px-5 py-3 font-medium">Durum</th>
                <th className="px-5 py-3 font-medium">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {recentPosts.map((post) => (
                <tr
                  key={String(post._id)}
                  className="border-b border-card-border last:border-0 hover:bg-background/50"
                >
                  <td className="px-5 py-3 font-medium">{post.title}</td>
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
                </tr>
              ))}
              {recentPosts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-muted">
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
