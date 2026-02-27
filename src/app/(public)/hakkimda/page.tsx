import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımda",
  description: "Ben kimim, ne yapıyorum, becerilerim ve deneyimlerim.",
};

const skills = [
  { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { category: "Backend", items: ["Node.js", "Express", "MongoDB", "REST API"] },
  { category: "Araçlar", items: ["Git", "VS Code", "Figma", "Vercel"] },
];

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Hakkımda</h1>

      {/* Tanıtım */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-32 h-32 rounded-full bg-muted/20 flex items-center justify-center text-muted text-sm shrink-0">
            Fotoğraf
          </div>

          <div className="space-y-4 text-foreground/85 leading-relaxed">
            <p>
              Merhaba! Ben bir yazılım geliştiriciyim. Modern web teknolojileri
              ile kullanıcı dostu uygulamalar geliştirmeyi seviyorum.
            </p>
            <p>
              Bu blogda yazılım geliştirme, teknoloji trendleri, tasarım ve
              kişisel deneyimlerim hakkında yazılar paylaşıyorum. Amacım
              öğrendiklerimi paylaşarak topluluğa katkıda bulunmak.
            </p>
            <p>
              Boş zamanlarımda açık kaynak projelere katkıda bulunuyor, yeni
              teknolojileri keşfediyor ve blog yazıları yazıyorum.
            </p>
          </div>
        </div>
      </section>

      {/* Beceriler */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Beceriler</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {skills.map((group) => (
            <div
              key={group.category}
              className="bg-card border border-card-border rounded-xl p-5"
            >
              <h3 className="font-semibold text-primary mb-3">
                {group.category}
              </h3>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-foreground/85"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Deneyim Zaman Çizelgesi */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Deneyim</h2>
        <div className="space-y-6 border-l-2 border-card-border pl-6">
          <div>
            <div className="relative">
              <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-primary" />
              <h3 className="font-semibold">Full Stack Geliştirici</h3>
              <p className="text-sm text-muted mb-1">2024 - Günümüz</p>
              <p className="text-sm text-foreground/85">
                Modern web uygulamaları geliştirme, Next.js ve React ile
                frontend, Node.js ile backend çözümleri.
              </p>
            </div>
          </div>
          <div>
            <div className="relative">
              <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-muted" />
              <h3 className="font-semibold">Frontend Geliştirici</h3>
              <p className="text-sm text-muted mb-1">2022 - 2024</p>
              <p className="text-sm text-foreground/85">
                React ve TypeScript ile kullanıcı arayüzleri geliştirme,
                responsive tasarım ve performans optimizasyonu.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
