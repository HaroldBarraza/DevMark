// src/app/api/collections/[id]/bookmarks/route.ts
import { NextResponse } from "next/server";
import sql from "@/app/lib/databse";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const collectionId = params.id;

    const bookmarks = await sql`
      SELECT b.id, b.title, b.link, b.user_id AS "userId",
             b.created_at AS "createdAt",
             b.updated_at AS "updatedAt",
             b.description, b.image
      FROM bookmarks b
      JOIN collection_bookmarks cb ON cb.bookmark_id = b.id
      WHERE cb.collection_id = ${collectionId}
      ORDER BY b.created_at DESC;
    `;

    return NextResponse.json(bookmarks);
  } catch (error: any) {
    console.error("Error al obtener bookmarks de colección:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
