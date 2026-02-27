"use client";

import { useEffect, useState, useCallback } from "react";
import { slugify } from "@/lib/utils";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState<CategoryFormData>({
    name: "",
    slug: "",
    description: "",
  });

  const loadCategories = useCallback(async () => {
    const res = await fetch("/api/categories");
    if (res.ok) setCategories(await res.json());
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  function handleNameChange(value: string) {
    setForm({ ...form, name: value, slug: slugify(value) });
  }

  function handleEdit(cat: Category) {
    setEditingId(cat._id);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
    });
    setShowForm(true);
    setError("");
  }

  function handleCancel() {
    setShowForm(false);
    setEditingId(null);
    setForm({ name: "", slug: "", description: "" });
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const url = editingId
      ? `/api/categories/${editingId}`
      : "/api/categories";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Bir hata oluştu");
      return;
    }

    handleCancel();
    loadCategories();
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;

    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Silme hatası");
      return;
    }

    loadCategories();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kategoriler</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary text-white font-medium px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors text-sm cursor-pointer"
          >
            + Yeni Kategori
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-card border border-card-border rounded-xl p-5 mb-6">
          <h2 className="font-semibold mb-4">
            {editingId ? "Kategori Düzenle" : "Yeni Kategori"}
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1.5">Ad</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-input-border bg-input-bg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  placeholder="Kategori adı"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-input-border bg-input-bg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  placeholder="kategori-slug"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Açıklama</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-input-border bg-input-bg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                placeholder="Kategori açıklaması (opsiyonel)"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="bg-primary text-white font-medium px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors text-sm"
              >
                {editingId ? "Güncelle" : "Kaydet"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg border border-card-border text-sm hover:bg-background transition-colors cursor-pointer"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border text-left text-muted">
                <th className="px-5 py-3 font-medium">Ad</th>
                <th className="px-5 py-3 font-medium">Slug</th>
                <th className="px-5 py-3 font-medium">Açıklama</th>
                <th className="px-5 py-3 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat._id}
                  className="border-b border-card-border last:border-0 hover:bg-background/50"
                >
                  <td className="px-5 py-3 font-medium">{cat.name}</td>
                  <td className="px-5 py-3 text-muted">{cat.slug}</td>
                  <td className="px-5 py-3 text-muted">
                    {cat.description || "—"}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-card-border hover:border-primary hover:text-primary transition-colors cursor-pointer"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-card-border text-red-500 hover:border-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-muted">
                    Henüz kategori bulunmuyor.
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
