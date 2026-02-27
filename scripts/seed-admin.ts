/**
 * Admin kullanıcısı oluşturma scripti
 *
 * Kullanım:
 *   npx tsx scripts/seed-admin.ts
 *
 * .env.local dosyasında MONGODB_URI tanımlı olmalıdır.
 */

import { config } from "dotenv";
config({ path: ".env.local" });
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI ortam değişkeni tanımlı değil.");
  process.exit(1);
}

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI!);
  console.log("MongoDB bağlantısı kuruldu.");

  const email = "admin@blog.com";
  const password = "admin123";

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Admin kullanıcı zaten var: ${email}`);
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await User.create({ email, password: hashedPassword });

  console.log(`Admin kullanıcı oluşturuldu:`);
  console.log(`  E-posta: ${email}`);
  console.log(`  Şifre:   ${password}`);
  console.log(`\n⚠️  Şifreyi ilk girişten sonra değiştirmeyi unutmayın!`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Hata:", err);
  process.exit(1);
});
