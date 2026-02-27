"use client";

import { useRouter } from "next/navigation";

export default function DeletePostButton({ postId }: { postId: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;

    const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });

    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error || "Silme hatası");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-card-border text-red-500 hover:border-red-500 hover:bg-red-50 transition-colors cursor-pointer"
    >
      Sil
    </button>
  );
}
