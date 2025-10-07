import { NextRequest, NextResponse } from "next/server";
import { getTagById, updateTag, deleteTag } from "@/app/lib/tags/tagRepository";

// GET por tagId
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: tagId } = await params; // ← CAMBIO
  const tag = await getTagById(tagId);
  return NextResponse.json(tag);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: tagId } = await params; // ← CAMBIO
    const body = await req.json();
    const { name } = body;

    if (!name) return NextResponse.json({ error: "Missing name" }, { status: 400 });

    const tag = await updateTag(tagId, { name });
    return NextResponse.json(tag);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update tag" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: tagId } = await params; // ← CAMBIO
    if (!tagId) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await deleteTag(tagId);
    return NextResponse.json({ message: "Tag deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete tag" }, { status: 500 });
  }
}