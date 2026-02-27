import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPost extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  category: Types.ObjectId;
  tags: string[];
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
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

PostSchema.index({ status: 1, createdAt: -1 });
PostSchema.index({ category: 1 });
PostSchema.index({ tags: 1 });

export default mongoose.models.Post ||
  mongoose.model<IPost>("Post", PostSchema);
