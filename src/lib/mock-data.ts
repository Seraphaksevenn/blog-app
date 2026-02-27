export interface MockCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
}

export interface MockPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  category: MockCategory;
  tags: string[];
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

export const categories: MockCategory[] = [
  {
    _id: "cat1",
    name: "Teknoloji",
    slug: "teknoloji",
    description: "Teknoloji dünyasından haberler ve yazılar",
  },
  {
    _id: "cat2",
    name: "Yazılım",
    slug: "yazilim",
    description: "Yazılım geliştirme, programlama dilleri ve araçlar",
  },
  {
    _id: "cat3",
    name: "Tasarım",
    slug: "tasarim",
    description: "UI/UX tasarım, grafik ve web tasarım",
  },
  {
    _id: "cat4",
    name: "Kişisel",
    slug: "kisisel",
    description: "Kişisel deneyimler ve düşünceler",
  },
];

export const posts: MockPost[] = [
  {
    _id: "post1",
    title: "Next.js 16 ile Modern Web Geliştirme",
    slug: "nextjs-16-ile-modern-web-gelistirme",
    content: `## Next.js 16 Nedir?

Next.js 16, React tabanlı web uygulamaları geliştirmek için kullanılan popüler bir framework'ün en son sürümüdür. Bu sürüm, performans iyileştirmeleri ve yeni özellikler sunmaktadır.

### Öne Çıkan Özellikler

- **Turbopack**: Webpack'in yerini alan yeni bundler
- **Server Components**: Sunucu tarafında render edilen bileşenler
- **App Router**: Dosya tabanlı yönlendirme sistemi
- **Streaming**: Kademeli sayfa yükleme

### Neden Next.js?

Modern web geliştirmede Next.js tercih etmenin birçok nedeni var:

1. **SEO dostu** — Sunucu tarafı render desteği
2. **Performans** — Otomatik kod bölme ve optimizasyon
3. **Geliştirici deneyimi** — Hot reload ve TypeScript desteği
4. **Esneklik** — Statik ve dinamik sayfa desteği

\`\`\`typescript
// Örnek bir Server Component
export default async function Page() {
  const data = await fetch('https://api.example.com/posts');
  const posts = await data.json();

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
\`\`\`

Next.js 16 ile projelerinizi bir üst seviyeye taşıyabilirsiniz.`,
    excerpt:
      "Next.js 16 ile gelen yenilikler, Turbopack, Server Components ve daha fazlası hakkında detaylı bir inceleme.",
    coverImage: "/images/nextjs.jpg",
    category: categories[1],
    tags: ["nextjs", "react", "web"],
    status: "published",
    createdAt: "2026-02-25T10:00:00Z",
    updatedAt: "2026-02-25T10:00:00Z",
  },
  {
    _id: "post2",
    title: "TypeScript İpuçları ve En İyi Pratikler",
    slug: "typescript-ipuclari-ve-en-iyi-pratikler",
    content: `## TypeScript Neden Önemli?

TypeScript, JavaScript'e tip güvenliği ekleyerek daha güvenilir kod yazmamızı sağlar. Büyük projelerde hata oranını önemli ölçüde azaltır.

### Tip Güvenliği

TypeScript'in en büyük avantajı tip güvenliğidir. Derleme zamanında hataları yakalayarak runtime hatalarını önler.

### Generics Kullanımı

Generics, kodunuzu yeniden kullanılabilir hale getirmenin en etkili yollarından biridir.

\`\`\`typescript
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0];
}

const num = getFirst([1, 2, 3]); // number
const str = getFirst(["a", "b"]); // string
\`\`\`

### Utility Types

TypeScript'in yerleşik yardımcı tipleri günlük geliştirmede çok faydalıdır:

- \`Partial<T>\` — Tüm alanları opsiyonel yapar
- \`Required<T>\` — Tüm alanları zorunlu yapar
- \`Pick<T, K>\` — Belirli alanları seçer
- \`Omit<T, K>\` — Belirli alanları çıkarır

Bu pratikleri uygulayarak daha temiz ve güvenilir kod yazabilirsiniz.`,
    excerpt:
      "TypeScript ile daha güvenilir kod yazmanın yolları, generics, utility types ve en iyi pratikler.",
    coverImage: "/images/typescript.jpg",
    category: categories[1],
    tags: ["typescript", "javascript", "programlama"],
    status: "published",
    createdAt: "2026-02-20T14:30:00Z",
    updatedAt: "2026-02-21T09:00:00Z",
  },
  {
    _id: "post3",
    title: "Tailwind CSS v4: Yeni Nesil Stil Yaklaşımı",
    slug: "tailwind-css-v4-yeni-nesil-stil-yaklasimi",
    content: `## Tailwind CSS v4

Tailwind CSS v4, utility-first CSS framework'ünün en büyük güncellemesidir. Yeni motor, daha hızlı derleme süreleri ve gelişmiş özellikler sunuyor.

### Yenilikler

- **Yeni CSS motoru** — Lightning CSS tabanlı
- **CSS-first yapılandırma** — JavaScript config yerine CSS ile tema tanımlama
- **@theme direktifi** — Tema değişkenlerini doğrudan CSS'te tanımlama

### Örnek Kullanım

\`\`\`css
@import "tailwindcss";

@theme inline {
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
}
\`\`\`

Tailwind CSS v4, modern web projelerinde stil yönetimini kolaylaştırıyor.`,
    excerpt:
      "Tailwind CSS v4 ile gelen yeni CSS motoru, tema yapılandırması ve performans iyileştirmeleri.",
    coverImage: "/images/tailwind.jpg",
    category: categories[2],
    tags: ["tailwind", "css", "tasarim"],
    status: "published",
    createdAt: "2026-02-15T08:00:00Z",
    updatedAt: "2026-02-15T08:00:00Z",
  },
  {
    _id: "post4",
    title: "MongoDB ile Veritabanı Tasarımı",
    slug: "mongodb-ile-veritabani-tasarimi",
    content: `## MongoDB Nedir?

MongoDB, doküman tabanlı bir NoSQL veritabanıdır. JSON benzeri belgelerle çalışır ve esnek şema yapısı sunar.

### Şema Tasarımı

MongoDB'de şema tasarımı, ilişkisel veritabanlarından farklıdır. Embed vs Reference kararı önemlidir.

### Mongoose ile Modelleme

Mongoose, Node.js için MongoDB ODM kütüphanesidir.

\`\`\`typescript
const PostSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  content: String,
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
}, { timestamps: true });
\`\`\`

İyi bir veritabanı tasarımı, uygulamanızın performansını doğrudan etkiler.`,
    excerpt:
      "MongoDB ile etkili veritabanı tasarımı, Mongoose modelleme ve en iyi pratikler.",
    coverImage: "/images/mongodb.jpg",
    category: categories[0],
    tags: ["mongodb", "veritabani", "backend"],
    status: "published",
    createdAt: "2026-02-10T16:00:00Z",
    updatedAt: "2026-02-10T16:00:00Z",
  },
  {
    _id: "post5",
    title: "UI/UX Tasarımın Temel İlkeleri",
    slug: "ui-ux-tasarimin-temel-ilkeleri",
    content: `## UI/UX Nedir?

UI (User Interface) kullanıcı arayüzünü, UX (User Experience) ise kullanıcı deneyimini ifade eder.

### Temel İlkeler

1. **Tutarlılık** — Arayüz boyunca tutarlı tasarım dili
2. **Erişilebilirlik** — Herkesin kullanabileceği tasarım
3. **Sadelik** — Gereksiz karmaşıklıktan kaçınma
4. **Geri Bildirim** — Kullanıcı eylemlerine anında yanıt

### Renk Teorisi

Renk seçimi, kullanıcı deneyimini doğrudan etkiler. Kontrastlı ve uyumlu renk paletleri kullanmak önemlidir.

İyi bir tasarım, kullanıcının düşünmeden kullanabileceği bir arayüz oluşturmaktır.`,
    excerpt:
      "Kullanıcı arayüzü ve deneyimi tasarımının temel ilkeleri, renk teorisi ve erişilebilirlik.",
    coverImage: "/images/uiux.jpg",
    category: categories[2],
    tags: ["tasarim", "uiux", "web"],
    status: "published",
    createdAt: "2026-02-05T12:00:00Z",
    updatedAt: "2026-02-05T12:00:00Z",
  },
  {
    _id: "post6",
    title: "Yazılım Geliştirici Olarak Öğrendiklerim",
    slug: "yazilim-gelistirici-olarak-ogrendiklerim",
    content: `## Yolculuğum

Yazılım geliştirici olarak geçirdiğim yıllar boyunca birçok değerli ders öğrendim.

### En Önemli Dersler

1. **Sürekli öğrenme** — Teknoloji sürekli değişiyor
2. **Kod kalitesi** — Temiz kod yazmak uzun vadede zaman kazandırır
3. **İşbirliği** — Takım çalışması bireysel yetenekten önemlidir
4. **Hata yapmak** — Hatalardan öğrenmek gelişimin parçasıdır

Her gün yeni bir şey öğrenmeye devam ediyorum.`,
    excerpt:
      "Yazılım geliştirici olarak yıllar içinde edindiğim deneyimler ve öğrendiğim dersler.",
    coverImage: "/images/developer.jpg",
    category: categories[3],
    tags: ["kisisel", "kariyer", "yazilim"],
    status: "published",
    createdAt: "2026-01-28T10:00:00Z",
    updatedAt: "2026-01-28T10:00:00Z",
  },
];

export function getPublishedPosts(): MockPost[] {
  return posts
    .filter((p) => p.status === "published")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function getPostBySlug(slug: string): MockPost | undefined {
  return posts.find((p) => p.slug === slug && p.status === "published");
}

export function getPostsByCategory(categorySlug: string): MockPost[] {
  return getPublishedPosts().filter(
    (p) => p.category.slug === categorySlug
  );
}
