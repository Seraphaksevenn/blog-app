import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Benimle iletişime geçin. Sorularınız, önerileriniz veya işbirliği teklifleriniz için form doldurun.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
