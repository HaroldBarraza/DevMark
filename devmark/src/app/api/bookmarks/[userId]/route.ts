import { NextResponse } from 'next/server';
import { getBookmarksByUser } from '@/app/lib/bookmarkaction/queris';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const bookmarks = await getBookmarksByUser(params.userId);
    return NextResponse.json(bookmarks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 });
  }
}
