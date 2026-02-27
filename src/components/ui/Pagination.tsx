import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseHref: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseHref,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const separator = baseHref.includes("?") ? "&" : "?";

  function pageHref(page: number) {
    return `${baseHref}${separator}sayfa=${page}`;
  }

  return (
    <nav className="flex justify-center items-center gap-2 mt-12">
      {currentPage > 1 && (
        <Link
          href={pageHref(currentPage - 1)}
          className="px-4 py-2 rounded-lg border border-card-border hover:border-primary transition-colors"
        >
          &larr; Önceki
        </Link>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={pageHref(page)}
          className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
            page === currentPage
              ? "bg-primary text-white"
              : "border border-card-border hover:border-primary"
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={pageHref(currentPage + 1)}
          className="px-4 py-2 rounded-lg border border-card-border hover:border-primary transition-colors"
        >
          Sonraki &rarr;
        </Link>
      )}
    </nav>
  );
}
