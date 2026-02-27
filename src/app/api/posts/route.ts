import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { auth } from "@/lib/auth";

// GET /api/posts — Yazı listele
export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const all = searchParams.get("all"); // admin için tüm yazılar

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (!all) filter.status = "published"; // public varsayılan
  if (category) filter.category = category;

  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments(filter),
  ]);

  return NextResponse.json({
    posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

// POST /api/posts — Yazı oluştur (auth gerekli)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  await dbConnect();

  const body = await req.json();
  const { title, slug, content, excerpt, coverImage, category, tags, status } =
    body;

  if (!title || !slug || !content || !excerpt || !category) {
    return NextResponse.json(
      { error: "Zorunlu alanlar eksik" },
      { status: 400 }
    );
  }

  const existing = await Post.findOne({ slug });
  if (existing) {
    return NextResponse.json(
      { error: "Bu slug zaten kullanılıyor" },
      { status: 409 }
    );
  }

  const post = await Post.create({
    title,
    slug,
    content,
    excerpt,
    coverImage,
    category,
    tags: tags || [],
    status: status || "draft",
  });

  return NextResponse.json(post, { status: 201 });
}
