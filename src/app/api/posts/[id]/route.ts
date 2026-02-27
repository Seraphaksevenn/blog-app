import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { auth } from "@/lib/auth";

// GET /api/posts/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;

  const post = await Post.findById(id)
    .populate("category", "name slug")
    .lean();

  if (!post) {
    return NextResponse.json({ error: "Yazı bulunamadı" }, { status: 404 });
  }

  return NextResponse.json(post);
}

// PUT /api/posts/[id] (auth gerekli)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  await dbConnect();
  const { id } = await params;
  const body = await req.json();

  const existing = await Post.findById(id);
  if (!existing) {
    return NextResponse.json({ error: "Yazı bulunamadı" }, { status: 404 });
  }

  // Slug değiştiyse çakışma kontrolü
  if (body.slug && body.slug !== existing.slug) {
    const slugExists = await Post.findOne({ slug: body.slug, _id: { $ne: id } });
    if (slugExists) {
      return NextResponse.json(
        { error: "Bu slug zaten kullanılıyor" },
        { status: 409 }
      );
    }
  }

  const updated = await Post.findByIdAndUpdate(id, body, {
    new: true,
  }).populate("category", "name slug");

  return NextResponse.json(updated);
}

// DELETE /api/posts/[id] (auth gerekli)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  await dbConnect();
  const { id } = await params;

  const deleted = await Post.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ error: "Yazı bulunamadı" }, { status: 404 });
  }

  return NextResponse.json({ message: "Yazı silindi" });
}
