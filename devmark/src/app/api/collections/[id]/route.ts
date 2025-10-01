import { NextResponse } from "next/server";
import { getCollectionById, updateCollection, deleteCollection } from "@/app/lib/collections/collectionRepository";

// GET /api/collections/:id
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const collection = await getCollectionById(params.id);
    return NextResponse.json(collection);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/collections/:id
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const updates = await req.json();
    const collection = await updateCollection(params.id, updates);
    return NextResponse.json(collection);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/collections/:id
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const deleted = await deleteCollection(params.id);
    return NextResponse.json(deleted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
