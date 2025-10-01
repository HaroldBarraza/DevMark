import { NextResponse } from "next/server";
import { createCollection, getCollectionsByUser } from "@/app/lib/collections/collectionRepository";

// GET /api/collections?userId=...
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) return NextResponse.json([], { status: 200 });

  try {
    const collections = await getCollectionsByUser(userId);
    return NextResponse.json(collections || []); 
  } catch (error: any) {
    console.error("Error al obtener colecciones:", error);
    return NextResponse.json([], { status: 500 }); 
  }
}


// POST /api/collections
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const collection = await createCollection(body);
    return NextResponse.json(collection, { status: 201 });
  } catch (error: any) {
    console.error("Error al crear colección:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
