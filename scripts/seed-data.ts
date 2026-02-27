import { config } from "dotenv";
config({ path: ".env.local" });

import mongoose, { Schema } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI ortam değişkeni tanımlı değil.");
  process.exit(1);
}

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    coverImage: { type: String },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    tags: [{ type: String }],
    status: { type: String, enum: ["draft", "published"], default: "draft" },
  },
  { timestamps: true }
);

const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);

const categories = [
  {
    name: "JavaScript",
    slug: "javascript",
    description: "JavaScript programlama dili hakkında yazılar",
  },
  {
    name: "React",
    slug: "react",
    description: "React kütüphanesi ve ekosistemi",
  },
  {
    name: "Next.js",
    slug: "nextjs",
    description: "Next.js framework hakkında rehberler",
  },
  {
    name: "Tasarım",
    slug: "tasarim",
    description: "UI/UX tasarım ve CSS konuları",
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI!);
  console.log("MongoDB bağlantısı kuruldu.\n");

  // Kategorileri ekle
  const createdCategories = [];
  for (const cat of categories) {
    const existing = await Category.findOne({ slug: cat.slug });
    if (existing) {
      console.log(`  Kategori zaten var: ${cat.name}`);
      createdCategories.push(existing);
    } else {
      const created = await Category.create(cat);
      console.log(`  Kategori oluşturuldu: ${cat.name}`);
      createdCategories.push(created);
    }
  }

  console.log(`\n${createdCategories.length} kategori hazır.\n`);

  // Yazıları ekle
  const posts = [
    {
      title: "JavaScript'te Async/Await Rehberi",
      slug: "javascript-async-await-rehberi",
      excerpt:
        "Asenkron programlamayı basitleştiren async/await yapısını adım adım öğrenin.",
      category: createdCategories[0]._id,
      tags: ["javascript", "async", "promise"],
      status: "published",
      content: `## Giriş

JavaScript'te asenkron programlama, modern web geliştirmenin temel taşlarından biridir. **Async/Await** syntax'ı, Promise tabanlı kodları çok daha okunabilir hale getirir.

## Promise Nedir?

Promise, gelecekte tamamlanacak (veya başarısız olacak) bir işlemi temsil eden nesnedir:

\`\`\`javascript
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("Veri geldi!"), 1000);
  });
};
\`\`\`

## Async/Await Kullanımı

\`async\` anahtar kelimesi bir fonksiyonu asenkron yapar, \`await\` ise bir Promise'in çözülmesini bekler:

\`\`\`javascript
async function getData() {
  const result = await fetchData();
  console.log(result); // "Veri geldi!"
}
\`\`\`

## Hata Yakalama

Try-catch bloğu ile hataları kolayca yakalayabiliriz:

\`\`\`javascript
async function getData() {
  try {
    const result = await fetchData();
    return result;
  } catch (error) {
    console.error("Hata:", error);
  }
}
\`\`\`

## Paralel İşlemler

Birden fazla asenkron işlemi paralel çalıştırmak için \`Promise.all\` kullanın:

\`\`\`javascript
const [users, posts] = await Promise.all([
  fetchUsers(),
  fetchPosts()
]);
\`\`\`

## Sonuç

Async/Await, JavaScript'te asenkron programlamayı çok daha kolay ve okunabilir hale getirir. Callback hell'den kurtulmanın en modern yoludur.`,
    },
    {
      title: "React Hooks ile State Yönetimi",
      slug: "react-hooks-state-yonetimi",
      excerpt:
        "useState, useEffect ve useContext hook'larını projelerinizde nasıl kullanacağınızı öğrenin.",
      category: createdCategories[1]._id,
      tags: ["react", "hooks", "state-management"],
      status: "published",
      content: `## React Hooks Nedir?

React Hooks, fonksiyonel bileşenlerde state ve lifecycle özelliklerini kullanmamızı sağlayan fonksiyonlardır. React 16.8 ile tanıtıldı.

## useState

En temel hook olan \`useState\`, bileşenlere state ekler:

\`\`\`javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Sayaç: {count}</p>
      <button onClick={() => setCount(count + 1)}>Artır</button>
    </div>
  );
}
\`\`\`

## useEffect

Side effect'leri yönetmek için kullanılır — veri çekme, DOM manipülasyonu, abonelikler gibi:

\`\`\`javascript
useEffect(() => {
  document.title = \`Sayaç: \${count}\`;
}, [count]); // count değiştiğinde çalışır
\`\`\`

## useContext

Prop drilling sorununu çözer. Global state'i bileşen ağacında kolayca paylaşır:

\`\`\`javascript
const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Navbar />
    </ThemeContext.Provider>
  );
}

function Navbar() {
  const theme = useContext(ThemeContext);
  return <nav className={theme}>...</nav>;
}
\`\`\`

## Custom Hooks

Kendi hook'larınızı oluşturarak mantığı yeniden kullanılabilir hale getirebilirsiniz:

\`\`\`javascript
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
\`\`\`

## Sonuç

React Hooks, modern React geliştirmenin vazgeçilmez bir parçasıdır. Fonksiyonel bileşenlerle güçlü uygulamalar geliştirmenizi sağlar.`,
    },
    {
      title: "Next.js 16 ile Full-Stack Uygulama Geliştirme",
      slug: "nextjs-16-fullstack-uygulama",
      excerpt:
        "Next.js 16'nın yeni özelliklerini kullanarak sıfırdan full-stack bir uygulama nasıl geliştirilir?",
      category: createdCategories[2]._id,
      tags: ["nextjs", "fullstack", "react", "typescript"],
      status: "published",
      content: `## Next.js 16 Nedir?

Next.js 16, React tabanlı full-stack web uygulamaları geliştirmek için en güçlü framework'tür. App Router, Server Components ve Turbopack ile birlikte gelir.

## Proje Oluşturma

\`\`\`bash
npx create-next-app@latest my-app --typescript --tailwind --app
\`\`\`

## App Router

Next.js 16'da dosya tabanlı routing kullanılır:

- \`app/page.tsx\` → \`/\`
- \`app/blog/page.tsx\` → \`/blog\`
- \`app/blog/[slug]/page.tsx\` → \`/blog/:slug\`

## Server Components

Varsayılan olarak tüm bileşenler server component'tir:

\`\`\`typescript
// Bu bir Server Component - doğrudan DB'ye erişebilir
export default async function BlogPage() {
  const posts = await db.posts.findMany();

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
\`\`\`

## API Routes

\`app/api\` klasöründe API endpoint'leri oluşturabilirsiniz:

\`\`\`typescript
// app/api/posts/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const posts = await db.posts.findMany();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const body = await request.json();
  const post = await db.posts.create({ data: body });
  return NextResponse.json(post, { status: 201 });
}
\`\`\`

## Metadata ve SEO

Next.js 16 ile SEO optimizasyonu çok kolaydır:

\`\`\`typescript
export const metadata = {
  title: 'Blog',
  description: 'Yazılım üzerine yazılar',
};
\`\`\`

## Sonuç

Next.js 16, modern web geliştirmenin en kapsamlı çözümüdür. Server Components, streaming ve Turbopack ile üstün performans sunar.`,
    },
    {
      title: "Tailwind CSS ile Modern UI Tasarımı",
      slug: "tailwind-css-modern-ui-tasarimi",
      excerpt:
        "Tailwind CSS kullanarak hızlı, responsive ve şık arayüzler tasarlamayı öğrenin.",
      category: createdCategories[3]._id,
      tags: ["tailwind", "css", "ui-tasarim", "responsive"],
      status: "published",
      content: `## Tailwind CSS Nedir?

Tailwind CSS, utility-first bir CSS framework'üdür. Önceden tanımlanmış sınıflar kullanarak hızlıca arayüz oluşturmanızı sağlar.

## Neden Tailwind?

- **Hızlı geliştirme**: CSS dosyası yazmadan doğrudan HTML'de stil verebilirsiniz
- **Tutarlı tasarım**: Önceden tanımlı renk paleti, spacing ve typography
- **Küçük bundle boyutu**: Sadece kullandığınız sınıflar dahil edilir

## Temel Kullanım

\`\`\`html
<div class="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
  <h2 class="text-2xl font-bold text-gray-900 mb-2">
    Başlık
  </h2>
  <p class="text-gray-600 leading-relaxed">
    Açıklama metni buraya gelecek.
  </p>
  <button class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
    Devamını Oku
  </button>
</div>
\`\`\`

## Responsive Tasarım

Tailwind'in breakpoint prefix'leri ile responsive tasarım çok kolaydır:

\`\`\`html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Kartlar -->
</div>
\`\`\`

- \`sm:\` → 640px ve üzeri
- \`md:\` → 768px ve üzeri
- \`lg:\` → 1024px ve üzeri
- \`xl:\` → 1280px ve üzeri

## Dark Mode

\`dark:\` prefix'i ile kolayca karanlık tema desteği ekleyebilirsiniz:

\`\`\`html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  İçerik
</div>
\`\`\`

## Tailwind v4 Yenilikleri

Tailwind CSS v4 ile CSS-first yapılandırma geldi:

\`\`\`css
@import "tailwindcss";

@theme inline {
  --color-primary: #2563eb;
  --color-accent: #f0f9ff;
}
\`\`\`

## Sonuç

Tailwind CSS, modern web tasarımının en verimli araçlarından biridir. Utility-first yaklaşımı sayesinde hem hızlı hem de tutarlı arayüzler oluşturabilirsiniz.`,
    },
    {
      title: "TypeScript: Tip Güvenli JavaScript",
      slug: "typescript-tip-guvenli-javascript",
      excerpt:
        "TypeScript'in temel özelliklerini ve projelerinizde neden kullanmanız gerektiğini keşfedin.",
      category: createdCategories[0]._id,
      tags: ["typescript", "javascript", "tip-sistemi"],
      status: "published",
      content: `## TypeScript Nedir?

TypeScript, JavaScript'e statik tip sistemi ekleyen bir programlama dilidir. Microsoft tarafından geliştirilir ve büyük projelerde hata oranını önemli ölçüde azaltır.

## Neden TypeScript?

- **Erken hata tespiti**: Derleme zamanında hataları yakalar
- **Daha iyi IDE desteği**: Otomatik tamamlama, refactoring
- **Okunabilir kod**: Tipler, kodun ne yaptığını belgeler
- **Güvenli refactoring**: Tip sistemi değişikliklerin etkisini gösterir

## Temel Tipler

\`\`\`typescript
// Primitif tipler
let name: string = "Serap";
let age: number = 25;
let isActive: boolean = true;

// Array
let tags: string[] = ["react", "nextjs"];

// Object
interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string; // opsiyonel
}
\`\`\`

## Generics

Yeniden kullanılabilir, tip güvenli fonksiyonlar oluşturur:

\`\`\`typescript
function getFirst<T>(items: T[]): T | undefined {
  return items[0];
}

const firstNumber = getFirst([1, 2, 3]); // number
const firstName = getFirst(["a", "b"]); // string
\`\`\`

## Union ve Intersection Tipler

\`\`\`typescript
// Union: ya biri ya diğeri
type Status = "draft" | "published" | "archived";

// Intersection: ikisi birden
type AdminUser = User & { role: "admin"; permissions: string[] };
\`\`\`

## Utility Types

TypeScript'in yerleşik yardımcı tipleri:

\`\`\`typescript
// Partial: tüm alanları opsiyonel yapar
type UpdateUser = Partial<User>;

// Pick: sadece belirli alanları seçer
type UserPreview = Pick<User, "id" | "name">;

// Omit: belirli alanları çıkarır
type CreateUser = Omit<User, "id">;
\`\`\`

## Sonuç

TypeScript, JavaScript projelerinde güvenlik ve üretkenlik sağlar. Öğrenme eğrisi düşük olmasına rağmen faydaları çok büyüktür.`,
    },
    {
      title: "MongoDB ile NoSQL Veritabanı Tasarımı",
      slug: "mongodb-nosql-veritabani-tasarimi",
      excerpt:
        "MongoDB'nin temel kavramlarını ve verimli şema tasarımı stratejilerini öğrenin.",
      category: createdCategories[2]._id,
      tags: ["mongodb", "nosql", "veritabani", "mongoose"],
      status: "published",
      content: `## MongoDB Nedir?

MongoDB, belge tabanlı (document-oriented) bir NoSQL veritabanıdır. JSON benzeri belgeler (BSON) kullanır ve esnek şema yapısı sunar.

## Neden MongoDB?

- **Esnek şema**: Sabit tablo yapısına ihtiyaç duymaz
- **Yatay ölçekleme**: Sharding ile kolayca büyür
- **Hızlı geliştirme**: JavaScript/JSON dostu yapı
- **Zengin sorgulama**: Aggregation pipeline, text search

## Mongoose ile Şema Tanımlama

\`\`\`typescript
import mongoose, { Schema } from 'mongoose';

const PostSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  tags: [{ type: String }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
}, { timestamps: true });
\`\`\`

## İlişkiler

MongoDB'de ilişkiler iki şekilde kurulur:

### Embedding (Gömme)
\`\`\`javascript
// Yorum, yazının içinde gömülü
{
  title: "Yazı Başlığı",
  comments: [
    { text: "Harika yazı!", author: "Ali" },
    { text: "Teşekkürler", author: "Veli" }
  ]
}
\`\`\`

### Referencing (Referans)
\`\`\`javascript
// Kategori ayrı koleksiyonda, ID ile referans
{
  title: "Yazı Başlığı",
  category: ObjectId("64a...")
}
\`\`\`

## İndeksleme

Sorgu performansı için indeksler kritiktir:

\`\`\`typescript
PostSchema.index({ status: 1, createdAt: -1 });
PostSchema.index({ category: 1 });
PostSchema.index({ tags: 1 });
\`\`\`

## Aggregation Pipeline

Karmaşık veri işlemleri için güçlü bir araçtır:

\`\`\`javascript
const stats = await Post.aggregate([
  { $match: { status: 'published' } },
  { $group: { _id: '$category', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);
\`\`\`

## Sonuç

MongoDB, modern web uygulamaları için güçlü ve esnek bir veritabanı çözümüdür. Doğru şema tasarımı ve indeksleme ile yüksek performanslı uygulamalar geliştirebilirsiniz.`,
    },
  ];

  for (const post of posts) {
    const existing = await Post.findOne({ slug: post.slug });
    if (existing) {
      console.log(`  Yazı zaten var: ${post.title}`);
    } else {
      await Post.create(post);
      console.log(`  Yazı oluşturuldu: ${post.title}`);
    }
  }

  console.log(`\nToplam ${posts.length} yazı hazır.`);
  console.log("\nTest verisi başarıyla eklendi!");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Hata:", err);
  process.exit(1);
});
