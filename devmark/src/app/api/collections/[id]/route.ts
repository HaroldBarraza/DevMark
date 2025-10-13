import { NextResponse } from "next/server";
import { getCollectionById, updateCollection, deleteCollection } from "@/app/lib/collections/collectionRepository";

/**
 * GET handler for retrieving a specific collection by ID
 * Returns collection details if found
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const collection = await getCollectionById(id);
    return NextResponse.json(collection);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

/**
 * PUT handler for updating an existing collection
 * Accepts partial collection data and applies updates
 */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const updates = await req.json();
    const collection = await updateCollection(id, updates);
    return NextResponse.json(collection);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

/**
 * DELETE handler for removing a collection
 * Returns the deleted collection data upon successful deletion
 */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deleted = await deleteCollection(id);
    return NextResponse.json(deleted);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}