import { NextRequest, NextResponse } from "next/server";
import { getTagById, updateTag, deleteTag } from "@/app/lib/tags/tagRepository";

/**
 * GET handler for retrieving a specific tag by ID
 * Returns tag details including name and metadata
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: tagId } = await params;
    const tag = await getTagById(tagId);
    return NextResponse.json(tag);
  } catch (error) {
    console.error('Error fetching tag:', error);
    return NextResponse.json({ error: 'Failed to fetch tag' }, { status: 500 });
  }
}

/**
 * PUT handler for updating an existing tag
 * Accepts new tag name in request body and updates the tag
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: tagId } = await params;
    const body = await req.json();
    const { name } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: "Tag name is required" }, { status: 400 });
    }

    const tag = await updateTag(tagId, { name });
    return NextResponse.json(tag);
  } catch (error) {
    console.error('Error updating tag:', error);
    return NextResponse.json({ error: "Failed to update tag" }, { status: 500 });
  }
}

/**
 * DELETE handler for removing a tag
 * Removes the tag and its associations with bookmarks
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: tagId } = await params;
    
    // Validate tag ID
    if (!tagId) {
      return NextResponse.json({ error: "Tag ID is required" }, { status: 400 });
    }

    await deleteTag(tagId);
    return NextResponse.json({ message: "Tag deleted successfully" });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json({ error: "Failed to delete tag" }, { status: 500 });
  }
}