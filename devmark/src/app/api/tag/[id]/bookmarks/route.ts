import { NextRequest, NextResponse } from 'next/server';
import { getBookmarksByTag } from '@/app/lib/bookmarkaction/queris';

/**
 * GET handler for retrieving all bookmarks associated with a specific tag
 * Returns bookmarks that have the specified tag for the authenticated user
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tagId } = await params;
    const userId = req.nextUrl.searchParams.get('userId');

    // Validate required parameters
    if (!userId) {
      return NextResponse.json({ error: 'User ID missing' }, { status: 400 });
    }

    // Fetch bookmarks filtered by tag and user
    const bookmarks = await getBookmarksByTag(tagId, userId);
    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error('Error fetching bookmarks by tag:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookmarks' },
      { status: 500 }
    );
  }
}