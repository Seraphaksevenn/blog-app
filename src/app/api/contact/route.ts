import { NextRequest, NextResponse } from "next/server";

// POST /api/contact — İletişim formu
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, subject, message } = body;

  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      { error: "Tüm alanlar zorunludur" },
      { status: 400 }
    );
  }

  // E-posta formatı kontrolü
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Geçersiz e-posta adresi" },
      { status: 400 }
    );
  }

  // Burada e-posta gönderme servisi entegre edilebilir (Resend, Nodemailer vb.)
  // Şimdilik sadece logluyoruz
  console.log("İletişim formu:", { name, email, subject, message });

  return NextResponse.json({ message: "Mesajınız başarıyla gönderildi" });
}
