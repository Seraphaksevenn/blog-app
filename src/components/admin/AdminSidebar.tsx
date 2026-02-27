"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: "◫" },
  { href: "/admin/yazilar", label: "Yazılar", icon: "✎" },
  { href: "/admin/kategoriler", label: "Kategoriler", icon: "▤" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-64 bg-card border-r border-card-border min-h-screen flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-card-border">
        <Link href="/admin" className="text-xl font-bold text-primary">
          Blog Admin
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive(link.href)
                ? "bg-accent text-primary"
                : "text-foreground/70 hover:text-foreground hover:bg-background"
            }`}
          >
            <span className="text-base">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Alt Kısım */}
      <div className="px-3 py-4 border-t border-card-border space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground/70 hover:text-foreground hover:bg-background transition-colors"
        >
          <span className="text-base">↗</span>
          Siteyi Görüntüle
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <span className="text-base">⎋</span>
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
