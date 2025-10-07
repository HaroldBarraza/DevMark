// src/app/api/bookmarks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getBookmarksByUserWithTags } from '@/app/lib/bookmarkaction/queris';

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json([], { status: 200 });

    const bookmarks = await getBookmarksByUserWithTags(userId);
    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 });
  }
}
