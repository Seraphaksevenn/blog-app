import { config } from "dotenv";
config({ path: ".env.local" });

import mongoose, { Schema } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI ortam değişkeni tanımlı değil.");
  process.exit(1);
}

const PostSchema = new Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    content: String,
    excerpt: String,
    coverImage: String,
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    tags: [String],
    status: String,
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);

const covers: Record<string, string> = {
  "javascript-async-await-rehberi":
    "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop&q=80",
  "react-hooks-state-yonetimi":
    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop&q=80",
  "nextjs-16-fullstack-uygulama":
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop&q=80",
  "tailwind-css-modern-ui-tasarimi":
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop&q=80",
  "typescript-tip-guvenli-javascript":
    "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop&q=80",
  "mongodb-nosql-veritabani-tasarimi":
    "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop&q=80",
};

async function update() {
  await mongoose.connect(MONGODB_URI!);
  console.log("MongoDB bağlantısı kuruldu.\n");

  for (const [slug, coverImage] of Object.entries(covers)) {
    const result = await Post.updateOne({ slug }, { $set: { coverImage } });
    if (result.matchedCount > 0) {
      console.log(`  Kapak eklendi: ${slug}`);
    } else {
      console.log(`  Yazı bulunamadı: ${slug}`);
    }
  }

  console.log("\nTüm kapak fotoğrafları güncellendi!");
  await mongoose.disconnect();
}

update().catch((err) => {
  console.error("Hata:", err);
  process.exit(1);
});
