import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import { auth } from "@/lib/auth";

// GET /api/categories
export async function GET() {
  await dbConnect();
  const categories = await Category.find().sort({ name: 1 }).lean();
  return NextResponse.json(categories);
}

// POST /api/categories (auth gerekli)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  await dbConnect();
  const body = await req.json();
  const { name, slug, description } = body;

  if (!name || !slug) {
    return NextResponse.json(
      { error: "Ad ve slug zorunlu" },
      { status: 400 }
    );
  }

  const existing = await Category.findOne({ $or: [{ name }, { slug }] });
  if (existing) {
    return NextResponse.json(
      { error: "Bu ad veya slug zaten kullanılıyor" },
      { status: 409 }
    );
  }

  const category = await Category.create({ name, slug, description });
  return NextResponse.json(category, { status: 201 });
}
