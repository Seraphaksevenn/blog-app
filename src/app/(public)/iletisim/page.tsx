"use client";

import { useState } from "react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const body = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Bir hata oluştu");
      return;
    }

    setSuccess(true);
    e.currentTarget.reset();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">İletişim</h1>
      <p className="text-muted mb-10">
        Bir sorunuz, öneriniz veya işbirliği teklifiniz mi var? Aşağıdaki formu
        doldurarak bana ulaşabilirsiniz.
      </p>

      <div className="grid gap-10 md:grid-cols-3">
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
              Mesajınız başarıyla gönderildi!
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1.5">
              Ad Soyad
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-input-border bg-input-bg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="Adınız Soyadınız"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
              E-posta
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-input-border bg-input-bg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="ornek@email.com"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-1.5">
              Konu
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-input-border bg-input-bg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              placeholder="Mesajınızın konusu"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1.5">
              Mesaj
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-input-border bg-input-bg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
              placeholder="Mesajınızı yazın..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            {loading ? "Gönderiliyor..." : "Gönder"}
          </button>
        </form>

        <aside className="space-y-6">
          <div className="bg-card border border-card-border rounded-xl p-5">
            <h2 className="font-semibold mb-4">Diğer Kanallar</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">&#9993;</span>
                <div>
                  <p className="font-medium">E-posta</p>
                  <p className="text-muted">ornek@email.com</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">&#128279;</span>
                <div>
                  <p className="font-medium">GitHub</p>
                  <p className="text-muted">github.com/kullanici</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">&#128279;</span>
                <div>
                  <p className="font-medium">LinkedIn</p>
                  <p className="text-muted">linkedin.com/in/kullanici</p>
                </div>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
