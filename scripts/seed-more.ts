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

async function seed() {
  await mongoose.connect(MONGODB_URI!);
  console.log("MongoDB bağlantısı kuruldu.\n");

  // Mevcut kategorileri al
  const jsCategory = await Category.findOne({ slug: "javascript" });
  const reactCategory = await Category.findOne({ slug: "react" });
  const nextjsCategory = await Category.findOne({ slug: "nextjs" });
  const tasarimCategory = await Category.findOne({ slug: "tasarim" });

  const posts = [
    {
      title: "Node.js ile REST API Geliştirme Rehberi",
      slug: "nodejs-rest-api-gelistirme",
      excerpt:
        "Express.js kullanarak profesyonel seviyede RESTful API nasıl geliştirilir? Adım adım öğrenin.",
      category: jsCategory._id,
      tags: ["nodejs", "express", "api", "backend"],
      status: "published",
      coverImage:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop&q=80",
      content: `## REST API Nedir?

REST (Representational State Transfer), web servislerinde en yaygın kullanılan mimari stildir. HTTP protokolü üzerinden **CRUD** işlemlerini gerçekleştirir.

## Proje Kurulumu

\`\`\`bash
mkdir my-api && cd my-api
npm init -y
npm install express cors dotenv
npm install -D typescript @types/express @types/node ts-node nodemon
\`\`\`

## Express Sunucusu

\`\`\`typescript
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.listen(3001, () => {
  console.log('API sunucusu 3001 portunda çalışıyor');
});
\`\`\`

## Route Yapısı

RESTful API'lerde her kaynak için standart endpoint'ler tanımlanır:

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | /api/users | Tüm kullanıcıları listele |
| GET | /api/users/:id | Tek kullanıcı getir |
| POST | /api/users | Yeni kullanıcı oluştur |
| PUT | /api/users/:id | Kullanıcı güncelle |
| DELETE | /api/users/:id | Kullanıcı sil |

\`\`\`typescript
import { Router } from 'express';

const router = Router();

router.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.post('/users', async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
});

router.put('/users/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
});

router.delete('/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).send();
});
\`\`\`

## Middleware Kullanımı

Middleware'ler, request-response döngüsünde araya giren fonksiyonlardır:

\`\`\`typescript
// Auth middleware
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token gerekli' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ error: 'Geçersiz token' });
  }
}

router.get('/profile', authenticate, async (req, res) => {
  res.json(req.user);
});
\`\`\`

## Hata Yönetimi

Global error handler ile hataları merkezi olarak yönetin:

\`\`\`typescript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Sunucu hatası',
  });
});
\`\`\`

## Sonuç

Node.js ve Express ile güçlü, ölçeklenebilir API'ler geliştirebilirsiniz. Doğru yapılandırma, middleware kullanımı ve hata yönetimi ile profesyonel seviyede backend servisleri oluşturabilirsiniz.`,
    },
    {
      title: "CSS Grid ve Flexbox: Hangisini Ne Zaman Kullanmalı?",
      slug: "css-grid-flexbox-karsilastirma",
      excerpt:
        "CSS Grid ve Flexbox arasındaki farkları öğrenin ve projelerinizde doğru layout aracını seçin.",
      category: tasarimCategory._id,
      tags: ["css", "grid", "flexbox", "layout"],
      status: "published",
      coverImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&q=80",
      content: `## Flexbox vs Grid

CSS'te layout oluşturmanın iki modern yolu vardır: **Flexbox** ve **Grid**. İkisi de güçlüdür ama farklı senaryolarda parlar.

## Flexbox: Tek Boyutlu Layout

Flexbox, öğeleri **tek bir eksen** boyunca (yatay veya dikey) hizalamak için idealdir.

\`\`\`css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}
\`\`\`

### Flexbox Ne Zaman Kullanılır?

- **Navigasyon barları** — öğeleri yatay hizalama
- **Kartların içi** — içerik dikeyde hizalama
- **Buton grupları** — yan yana butonlar
- **Tek satır/sütun** düzenleri

## CSS Grid: İki Boyutlu Layout

Grid, **satır ve sütun** bazında karmaşık layout'lar oluşturmak için tasarlanmıştır.

\`\`\`css
.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.dashboard {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.dashboard-header { grid-column: 1 / -1; }
.dashboard-sidebar { grid-row: 2 / 3; }
.dashboard-main { grid-row: 2 / 3; }
.dashboard-footer { grid-column: 1 / -1; }
\`\`\`

### Grid Ne Zaman Kullanılır?

- **Sayfa layout'ları** — header, sidebar, main, footer
- **Kart grid'leri** — responsive galeri/blog kartları
- **Dashboard'lar** — karmaşık çok bölgeli yapılar
- **Form layout'ları** — label ve input hizalama

## Birlikte Kullanım

En iyi sonuç, ikisini birlikte kullanmaktan gelir:

\`\`\`css
/* Sayfa layout'u: Grid */
.page {
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 2rem;
}

/* Kartların içi: Flexbox */
.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
\`\`\`

## Responsive Tasarım

Grid ile responsive tasarım çok kolaydır:

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
\`\`\`

Bu tek satır kod, ekran genişliğine göre otomatik olarak sütun sayısını ayarlar!

## Sonuç

- **Flexbox** → tek eksen, içerik hizalama, küçük bileşenler
- **Grid** → iki eksen, sayfa layout'u, karmaşık yapılar
- **Birlikte** → Grid dış yapı için, Flexbox iç bileşenler için`,
    },
    {
      title: "React Server Components: Yeni Nesil Rendering",
      slug: "react-server-components-rehberi",
      excerpt:
        "React Server Components nedir, nasıl çalışır ve uygulamanızın performansını nasıl artırır?",
      category: reactCategory._id,
      tags: ["react", "server-components", "performans", "nextjs"],
      status: "published",
      coverImage:
        "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=800&h=400&fit=crop&q=80",
      content: `## Server Components Nedir?

React Server Components (RSC), bileşenlerin **sunucu tarafında** çalışıp render edilmesini sağlar. Bu sayede JavaScript bundle boyutu küçülür ve ilk yükleme hızı artar.

## Server vs Client Components

### Server Component (Varsayılan)
\`\`\`typescript
// Bu bir Server Component — "use client" yok
import db from '@/lib/db';

export default async function UserList() {
  const users = await db.users.findMany();

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
\`\`\`

### Client Component
\`\`\`typescript
"use client"; // Bu satır Client Component yapar

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Sayaç: {count}
    </button>
  );
}
\`\`\`

## Avantajları

- **Küçük bundle**: Server component kodu client'a gönderilmez
- **Doğrudan veri erişimi**: API endpoint'e gerek kalmadan DB'ye erişim
- **Güvenlik**: API key'ler ve hassas veriler client'a sızmaz
- **SEO dostu**: İçerik sunucu tarafında render edilir
- **Streaming**: Bileşenler hazır oldukça client'a gönderilir

## Ne Zaman Hangisi?

### Server Component Kullan:
- Veri çekme (fetch, DB sorgusu)
- Statik içerik gösterme
- SEO gerektiren sayfalar
- Büyük bağımlılıklar kullanan bileşenler

### Client Component Kullan:
- Event listener'lar (onClick, onChange)
- State yönetimi (useState, useReducer)
- Browser API'leri (localStorage, geolocation)
- Animasyonlar ve interaktif UI

## Composition Pattern

Server ve Client bileşenleri birlikte kullanmanın en iyi yolu:

\`\`\`typescript
// Server Component — veri çeker
async function BlogPage() {
  const posts = await fetchPosts();

  return (
    <div>
      <h1>Blog</h1>
      {/* Client Component'e veri prop olarak geçilir */}
      <SearchFilter posts={posts} />
    </div>
  );
}

// Client Component — interaktivite sağlar
"use client";
function SearchFilter({ posts }) {
  const [query, setQuery] = useState('');
  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(query)
  );

  return (
    <>
      <input onChange={e => setQuery(e.target.value)} />
      {filtered.map(post => <PostCard key={post.id} post={post} />)}
    </>
  );
}
\`\`\`

## Performans Karşılaştırması

| Metrik | Geleneksel CSR | Server Components |
|--------|---------------|-------------------|
| İlk Yükleme | Yavaş | Hızlı |
| Bundle Boyutu | Büyük | Küçük |
| SEO | Zayıf | Güçlü |
| İnteraktivite | Anında | Hydration sonrası |

## Sonuç

Server Components, React ekosisteminde bir paradigma değişimidir. Doğru kullanıldığında uygulamanızın hem performansını hem de geliştirici deneyimini önemli ölçüde artırır.`,
    },
    {
      title: "Git ve GitHub: Versiyon Kontrolü Rehberi",
      slug: "git-github-versiyon-kontrolu",
      excerpt:
        "Git'in temel komutlarını, branch stratejilerini ve GitHub iş akışlarını kapsamlı bir şekilde öğrenin.",
      category: jsCategory._id,
      tags: ["git", "github", "versiyon-kontrolu", "workflow"],
      status: "published",
      coverImage:
        "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=400&fit=crop&q=80",
      content: `## Git Nedir?

Git, dağıtık bir versiyon kontrol sistemidir. Kodunuzdaki her değişikliği takip eder ve ekip çalışmasını kolaylaştırır.

## Temel Komutlar

### Repo Oluşturma
\`\`\`bash
git init                    # Yeni repo oluştur
git clone <url>             # Mevcut repo'yu klonla
\`\`\`

### Değişiklikleri Kaydetme
\`\`\`bash
git status                  # Değişiklikleri gör
git add .                   # Tüm değişiklikleri stage'e al
git add dosya.ts            # Belirli dosyayı stage'e al
git commit -m "mesaj"       # Commit oluştur
\`\`\`

### Uzak Repo İşlemleri
\`\`\`bash
git push origin main        # Değişiklikleri gönder
git pull origin main        # Değişiklikleri çek
git fetch                   # Uzak değişiklikleri kontrol et
\`\`\`

## Branch Stratejisi

Branch'ler, paralel geliştirme yapmanızı sağlar:

\`\`\`bash
git branch feature/login    # Yeni branch oluştur
git checkout feature/login  # Branch'e geç
git checkout -b feature/api # Oluştur ve geç (kısayol)
\`\`\`

### Git Flow Modeli

- \`main\` — Production kodu
- \`develop\` — Geliştirme branch'i
- \`feature/*\` — Yeni özellikler
- \`hotfix/*\` — Acil düzeltmeler
- \`release/*\` — Sürüm hazırlığı

## Pull Request İş Akışı

1. Feature branch oluştur
2. Değişiklikleri yap ve commit et
3. GitHub'a push et
4. Pull Request aç
5. Code review al
6. Merge et

\`\`\`bash
git checkout -b feature/dark-mode
# ... kodlama ...
git add .
git commit -m "feat: dark mode eklendi"
git push -u origin feature/dark-mode
# GitHub'da PR aç
\`\`\`

## Commit Mesajı Kuralları

İyi commit mesajları yazmak ekip iletişimini güçlendirir:

\`\`\`
feat: kullanıcı profil sayfası eklendi
fix: login formundaki validasyon hatası düzeltildi
docs: README'ye kurulum adımları eklendi
refactor: auth middleware yeniden yapılandırıldı
style: header bileşeninin spacing'i düzenlendi
test: user API'si için birim testleri eklendi
\`\`\`

## Yararlı İpuçları

### Değişiklikleri Geçici Kaydetme
\`\`\`bash
git stash              # Değişiklikleri sakla
git stash pop          # Saklananları geri getir
\`\`\`

### Geçmişi İnceleme
\`\`\`bash
git log --oneline      # Kısa commit geçmişi
git log --graph        # Görsel branch grafiği
git diff               # Değişiklikleri karşılaştır
\`\`\`

### Hata Geri Alma
\`\`\`bash
git revert <hash>      # Commit'i geri al (güvenli)
git reset --soft HEAD~1 # Son commit'i geri al (değişiklikler kalır)
\`\`\`

## Sonuç

Git, her geliştiricinin bilmesi gereken temel bir araçtır. Branch stratejileri ve iyi commit alışkanlıkları ile projelerinizi profesyonelce yönetebilirsiniz.`,
    },
    {
      title: "Web Performans Optimizasyonu: Hız Rehberi",
      slug: "web-performans-optimizasyonu",
      excerpt:
        "Web sitenizi hızlandırmak için kullanabileceğiniz pratik optimizasyon tekniklerini keşfedin.",
      category: nextjsCategory._id,
      tags: ["performans", "web-vitals", "optimizasyon", "lighthouse"],
      status: "published",
      coverImage:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&q=80",
      content: `## Neden Performans Önemli?

Google araştırmalarına göre, sayfa yükleme süresi **3 saniyeyi** aştığında kullanıcıların %53'ü siteyi terk ediyor. Performans, kullanıcı deneyimi ve SEO için kritiktir.

## Core Web Vitals

Google'ın belirlediği üç temel metrik:

- **LCP** (Largest Contentful Paint) — En büyük içeriğin yüklenme süresi → < 2.5s
- **FID** (First Input Delay) — İlk etkileşim gecikmesi → < 100ms
- **CLS** (Cumulative Layout Shift) — Görsel kayma → < 0.1

## Görsel Optimizasyonu

Görseller, sayfa boyutunun genellikle %50'sinden fazlasını oluşturur:

\`\`\`typescript
// Next.js Image — otomatik optimizasyon
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority          // LCP görseli için
  sizes="(max-width: 768px) 100vw, 1200px"
  placeholder="blur" // Yükleme sırasında blur efekti
/>
\`\`\`

### Görsel Format Karşılaştırması

| Format | Boyut | Kalite | Destek |
|--------|-------|--------|--------|
| JPEG | Orta | İyi | Tüm tarayıcılar |
| PNG | Büyük | Mükemmel | Tüm tarayıcılar |
| WebP | Küçük | İyi | Modern tarayıcılar |
| AVIF | En küçük | Mükemmel | Yeni tarayıcılar |

## JavaScript Optimizasyonu

### Code Splitting
\`\`\`typescript
// Dinamik import ile lazy loading
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/Chart'), {
  loading: () => <p>Yükleniyor...</p>,
  ssr: false,
});
\`\`\`

### Tree Shaking
\`\`\`typescript
// Kötü — tüm kütüphane import edilir
import _ from 'lodash';

// İyi — sadece kullanılan fonksiyon
import debounce from 'lodash/debounce';
\`\`\`

## Caching Stratejileri

\`\`\`typescript
// Next.js'te veri cache'leme
const data = await fetch('https://api.example.com/posts', {
  next: { revalidate: 3600 } // 1 saat cache
});

// Static generation
export const revalidate = 3600;
\`\`\`

## Font Optimizasyonu

\`\`\`typescript
// Next.js Font — otomatik self-hosting
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // FOUT yerine swap
});
\`\`\`

## Lighthouse Skoru İyileştirme Kontrol Listesi

- Görselleri optimize et (WebP/AVIF, lazy loading, sizes)
- JavaScript'i bölümle (code splitting, dynamic import)
- CSS'i minimize et (kullanılmayan stilleri kaldır)
- Font'ları optimize et (swap, preload, self-host)
- Üçüncü parti script'leri ertele (async/defer)
- HTTP cache header'larını ayarla
- Sunucu yanıt süresini azalt (edge deploy, CDN)

## Sonuç

Web performansı sadece teknik bir konu değil, doğrudan kullanıcı deneyimi ve iş sonuçlarını etkiler. Küçük optimizasyonlar bile büyük fark yaratabilir.`,
    },
    {
      title: "React ile Form Yönetimi: Best Practices",
      slug: "react-form-yonetimi-best-practices",
      excerpt:
        "React'te form yönetimini basitleştiren teknikler, validasyon ve kullanıcı deneyimi ipuçları.",
      category: reactCategory._id,
      tags: ["react", "form", "validasyon", "ux"],
      status: "published",
      coverImage:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&q=80",
      content: `## React'te Form Yönetimi

Formlar, web uygulamalarının en kritik parçalarından biridir. Doğru yönetilmediğinde hem geliştirici hem de kullanıcı deneyimi kötüleşir.

## Controlled vs Uncontrolled

### Controlled Component
\`\`\`typescript
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form>
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
    </form>
  );
}
\`\`\`

### Uncontrolled (FormData)
\`\`\`typescript
function LoginForm() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');
    // API çağrısı...
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Giriş Yap</button>
    </form>
  );
}
\`\`\`

## Form Validasyonu

### Client-Side Validasyon
\`\`\`typescript
const [errors, setErrors] = useState<Record<string, string>>({});

function validate(data: { email: string; password: string }) {
  const newErrors: Record<string, string> = {};

  if (!data.email) {
    newErrors.email = 'E-posta zorunludur';
  } else if (!/\\S+@\\S+\\.\\S+/.test(data.email)) {
    newErrors.email = 'Geçerli bir e-posta girin';
  }

  if (!data.password) {
    newErrors.password = 'Şifre zorunludur';
  } else if (data.password.length < 6) {
    newErrors.password = 'Şifre en az 6 karakter olmalı';
  }

  return newErrors;
}
\`\`\`

### Hata Gösterimi
\`\`\`typescript
<div>
  <input
    name="email"
    className={errors.email ? 'border-red-500' : 'border-gray-300'}
  />
  {errors.email && (
    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
  )}
</div>
\`\`\`

## Loading ve Success States

Formda kullanıcıya geri bildirim vermek çok önemlidir:

\`\`\`typescript
const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

async function handleSubmit(data) {
  setStatus('loading');
  try {
    await submitForm(data);
    setStatus('success');
  } catch {
    setStatus('error');
  }
}

return (
  <form onSubmit={handleSubmit}>
    {/* ... form alanları ... */}

    <button disabled={status === 'loading'}>
      {status === 'loading' ? 'Gönderiliyor...' : 'Gönder'}
    </button>

    {status === 'success' && (
      <p className="text-green-600">Başarıyla gönderildi!</p>
    )}
    {status === 'error' && (
      <p className="text-red-600">Bir hata oluştu, tekrar deneyin.</p>
    )}
  </form>
);
\`\`\`

## Erişilebilirlik (a11y)

- Her input'a **label** bağlayın
- Hata mesajlarını **aria-describedby** ile ilişkilendirin
- **Tab sırası**nı doğru ayarlayın
- Zorunlu alanları **aria-required** ile işaretleyin

\`\`\`typescript
<div>
  <label htmlFor="email">E-posta</label>
  <input
    id="email"
    name="email"
    aria-required="true"
    aria-describedby={errors.email ? 'email-error' : undefined}
  />
  {errors.email && (
    <p id="email-error" role="alert">{errors.email}</p>
  )}
</div>
\`\`\`

## Sonuç

İyi bir form tasarımı: net validasyon, anlık geri bildirim, erişilebilirlik ve temiz kod yapısı gerektirir. Bu prensipleri uygulayarak kullanıcılarınıza harika bir deneyim sunabilirsiniz.`,
    },
  ];

  for (const post of posts) {
    const existing = await Post.findOne({ slug: post.slug });
    if (existing) {
      console.log(`  Zaten var: ${post.title}`);
    } else {
      await Post.create(post);
      console.log(`  Eklendi: ${post.title}`);
    }
  }

  console.log(`\n${posts.length} yeni yazı eklendi. Toplam yazı sayısı: ${await Post.countDocuments()}`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Hata:", err);
  process.exit(1);
});
