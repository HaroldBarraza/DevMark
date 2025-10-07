import { NextRequest, NextResponse } from "next/server";
import sql from "@/app/lib/databse";

export async function GET(
  _req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: collectionId } = await params; // ← CAMBIO
    
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
  } catch (error: unknown) {
    console.error("Error fetching bookmarks by collection:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}