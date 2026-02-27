import { BlogCardSkeleton } from "@/components/ui/Skeleton";
import Skeleton from "@/components/ui/Skeleton";

export default function BlogLoading() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <Skeleton className="h-9 w-48 mb-8" />

      {/* Kategori Filtresi Skeleton */}
      <div className="flex flex-wrap gap-2 mb-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-20 rounded-full" />
        ))}
      </div>

      {/* Kart Skeletonları */}
      <div className="grid gap-8 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
