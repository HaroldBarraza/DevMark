// src/app/api/collections/[id]/bookmarks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import sql from '@/app/lib/databse';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: collectionId } = await params;
    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID missing' }, { status: 400 });
    }

    const bookmarks = await sql`
      SELECT 
        b.id, 
        b.title, 
        b.link, 
        b.description,
        b.image,
        b.created_at as "createdAt",
        b.updated_at as "updatedAt",
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', t.id,
              'name', t.name
            )
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) as tags
      FROM bookmarks b
      INNER JOIN collection_bookmarks cb ON cb.bookmark_id = b.id
      LEFT JOIN bookmark_tags bt ON bt.bookmark_id = b.id
      LEFT JOIN tags t ON t.id = bt.tag_id
      WHERE cb.collection_id = ${collectionId} 
        AND b.user_id = ${userId}
      GROUP BY b.id
      ORDER BY b.created_at DESC;
    `;

    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error('Error fetching collection bookmarks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookmarks' },
      { status: 500 }
    );
  }
}