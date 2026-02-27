import Skeleton from "@/components/ui/Skeleton";

export default function BlogPostLoading() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Skeleton className="h-5 w-24 mb-8" />

      {/* Başlık Alanı */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-2/3" />
      </div>

      {/* Kapak Görseli */}
      <Skeleton className="h-64 md:h-80 rounded-xl mb-10" />

      {/* İçerik */}
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
        <Skeleton className="h-4 w-3/4" />
      </div>
    </main>
  );
}
