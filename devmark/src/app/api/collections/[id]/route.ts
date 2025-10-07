// src/app/api/collections/[id]/route.ts - CORREGIDO
import { NextResponse } from "next/server";
import { getCollectionById, updateCollection, deleteCollection } from "@/app/lib/collections/collectionRepository";

// GET /api/collections/:id
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const collection = await getCollectionById(id);
    return NextResponse.json(collection);
  } catch (error: unknown) { // ✅ Cambiar any por unknown
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const updates = await req.json();
    const collection = await updateCollection(id, updates);
    return NextResponse.json(collection);
  } catch (error: unknown) { // ✅ Cambiar any por unknown
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deleted = await deleteCollection(id);
    return NextResponse.json(deleted);
  } catch (error: unknown) { // ✅ Cambiar any por unknown
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}