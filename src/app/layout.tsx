import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Blog — Kişisel Blog Sitesi",
    template: "%s | Blog",
  },
  description:
    "Yazılım, teknoloji ve tasarım üzerine yazılar. Modern web geliştirme, TypeScript, React ve daha fazlası.",
  keywords: ["blog", "yazılım", "teknoloji", "react", "nextjs", "typescript"],
  authors: [{ name: "Serap" }],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: siteUrl,
    siteName: "Blog",
    title: "Blog — Kişisel Blog Sitesi",
    description:
      "Yazılım, teknoloji ve tasarım üzerine yazılar.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Kişisel Blog Sitesi",
    description:
      "Yazılım, teknoloji ve tasarım üzerine yazılar.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${geistSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
