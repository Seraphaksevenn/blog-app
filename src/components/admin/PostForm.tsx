"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { slugify } from "@/lib/utils";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface PostData {
  _id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  category: Category | string;
  tags: string[];
  status: "draft" | "published";
}

interface PostFormProps {
  initialData?: PostData;
}

export default function PostForm({ initialData }: PostFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [categoryId, setCategoryId] = useState(
    typeof initialData?.category === "object"
      ? initialData.category._id
      : initialData?.category || ""
  );
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [status, setStatus] = useState<"draft" | "published">(
    initialData?.status || "draft"
  );
  const [coverImage, setCoverImage] = useState(
    initialData?.coverImage || ""
  );
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!initialData) {
      setSlug(slugify(value));
    }
  }

  function handleAddTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      if (tag && !tags.includes(tag)) {
        setTags([...tags, tag]);
      }
      setTagInput("");
    }
  }

  function handleRemoveTag(tagToRemove: string) {
    setTags(tags.filter((t) => t !== tagToRemove));
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    setUploading(false);

    if (res.ok) {
      setCoverImage(data.url);
    } else {
      setError(data.error || "Yükleme hatası");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const body = {
      title,
      slug,
      content,
      excerpt,
      coverImage,
      category: categoryId,
      tags,
      status,
    };

    const url = initialData?._id
      ? `/api/posts/${initialData._id}`
      : "/api/posts";
    const method = initialData?._id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Bir hata oluştu");
      return;
    }

    router.push("/admin/yazilar");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sol: Ana İçerik */}
        <div className="lg:col-span-2 space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1.5">
              Başlık
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-input-border bg-input-bg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="Yazı başlığı"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium mb-1.5">
              Slug
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted">/blog/</span>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="flex-1 px-4 py-2.5 rounded-lg border border-input-border bg-input-bg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                placeholder="yazi-slug"
              />
            </div>
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium mb-1.5">
              Özet
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-input-border bg-input-bg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
              placeholder="Kısa açıklama..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="content" className="text-sm font-medium">
                İçerik (Markdown)
              </label>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-xs text-primary hover:underline cursor-pointer"
              >
                {showPreview ? "Editöre Dön" : "Önizleme"}
              </button>
            </div>

            {showPreview ? (
              <div className="min-h-[400px] px-4 py-3 rounded-lg border border-card-border bg-card">
                {content ? (
                  <ReactMarkdown
                    components={{
                      h2: ({ children }) => (
                        <h2 className="text-xl font-bold mt-6 mb-3">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-foreground/85 leading-relaxed mb-3">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc pl-6 mb-3 space-y-1">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal pl-6 mb-3 space-y-1">{children}</ol>
                      ),
                      code: ({ children, className }) => {
                        const isBlock = className?.includes("language-");
                        if (isBlock) {
                          return (
                            <code className="block bg-background border border-card-border rounded-lg p-3 overflow-x-auto text-sm my-3 font-mono">
                              {children}
                            </code>
                          );
                        }
                        return (
                          <code className="bg-accent px-1 py-0.5 rounded text-sm font-mono">
                            {children}
                          </code>
                        );
                      },
                      pre: ({ children }) => <pre className="not-prose">{children}</pre>,
                      strong: ({ children }) => (
                        <strong className="font-semibold">{children}</strong>
                      ),
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-muted text-sm">Önizlenecek içerik yok...</p>
                )}
              </div>
            ) : (
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={16}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-input-border bg-input-bg text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-y"
                placeholder="Markdown içerik yazın..."
              />
            )}
          </div>
        </div>

        {/* Sağ: Ayarlar Paneli */}
        <div className="space-y-5">
          <div className="bg-card border border-card-border rounded-xl p-5">
            <h3 className="font-semibold mb-3">Yayın Durumu</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={status === "draft"}
                  onChange={() => setStatus("draft")}
                  className="accent-primary"
                />
                <span className="text-sm">Taslak</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={status === "published"}
                  onChange={() => setStatus("published")}
                  className="accent-primary"
                />
                <span className="text-sm">Yayında</span>
              </label>
            </div>
          </div>

          <div className="bg-card border border-card-border rounded-xl p-5">
            <h3 className="font-semibold mb-3">Kategori</h3>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-input-border bg-input-bg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            >
              <option value="">Kategori seçin</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-card border border-card-border rounded-xl p-5">
            <h3 className="font-semibold mb-3">Etiketler</h3>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full px-3 py-2 rounded-lg border border-input-border bg-input-bg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="Etiket yazıp Enter'a basın"
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-accent text-primary text-xs px-2 py-1 rounded-full"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-500 cursor-pointer"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="bg-card border border-card-border rounded-xl p-5">
            <h3 className="font-semibold mb-3">Kapak Görseli</h3>
            {coverImage ? (
              <div className="relative">
                <img
                  src={coverImage}
                  alt="Kapak"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setCoverImage("")}
                  className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs cursor-pointer"
                >
                  &times;
                </button>
              </div>
            ) : (
              <label className="block h-32 border-2 border-dashed border-card-border rounded-lg flex items-center justify-center text-muted text-sm cursor-pointer hover:border-primary transition-colors">
                {uploading ? "Yükleniyor..." : "Görsel yükle"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            {loading
              ? "Kaydediliyor..."
              : initialData?._id
                ? "Güncelle"
                : "Kaydet"}
          </button>
        </div>
      </div>
    </form>
  );
}
