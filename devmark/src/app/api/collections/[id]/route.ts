// src/app/api/collections/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getCollectionById,
  updateCollection,
  deleteCollection,
} from "@/app/lib/collections/collectionRepository";

// GET /api/collections/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: collectionId } = await params;

    const collection = await getCollectionById(collectionId);
    return NextResponse.json(collection);
  } catch (error: unknown) {
    console.error("Error al obtener la colección:", error);
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/collections/:id
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: collectionId } = await params;
    const updates = await req.json();

    const collection = await updateCollection(collectionId, updates);
    return NextResponse.json(collection);
  } catch (error: unknown) {
    console.error("Error al actualizar la colección:", error);
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/collections/:id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: collectionId } = await params;

    const deleted = await deleteCollection(collectionId);
    return NextResponse.json(deleted);
  } catch (error: unknown) {
    console.error("Error al eliminar la colección:", error);
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
