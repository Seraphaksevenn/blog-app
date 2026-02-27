import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import Post from "@/models/Post";
import { auth } from "@/lib/auth";

// PUT /api/categories/[id] (auth gerekli)
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

  const existing = await Category.findById(id);
  if (!existing) {
    return NextResponse.json(
      { error: "Kategori bulunamadı" },
      { status: 404 }
    );
  }

  // Slug/name çakışma kontrolü
  if (body.slug || body.name) {
    const conflict = await Category.findOne({
      $or: [
        ...(body.name ? [{ name: body.name }] : []),
        ...(body.slug ? [{ slug: body.slug }] : []),
      ],
      _id: { $ne: id },
    });
    if (conflict) {
      return NextResponse.json(
        { error: "Bu ad veya slug zaten kullanılıyor" },
        { status: 409 }
      );
    }
  }

  const updated = await Category.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(updated);
}

// DELETE /api/categories/[id] (auth gerekli)
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

  // Kategoriye bağlı yazı var mı kontrol et
  const postCount = await Post.countDocuments({ category: id });
  if (postCount > 0) {
    return NextResponse.json(
      { error: `Bu kategoriye ait ${postCount} yazı var. Önce yazıları silmelisiniz.` },
      { status: 400 }
    );
  }

  const deleted = await Category.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json(
      { error: "Kategori bulunamadı" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Kategori silindi" });
}
