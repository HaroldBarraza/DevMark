import { NextRequest, NextResponse } from 'next/server';
import { getBookmarkByIdForUser } from '@/app/lib/bookmarkaction/queris';
import { updateBookmark, deleteBookmark } from '@/app/lib/bookmarkaction/actionbookamarlk';

/**
 * GET handler for retrieving a specific bookmark by ID
 * Validates user ownership before returning bookmark data
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'Invalid bookmark ID' }, { status: 400 });

    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'User ID missing' }, { status: 400 });

    const bookmark = await getBookmarkByIdForUser(id, userId);
    if (!bookmark) return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 });

    return NextResponse.json(bookmark);
  } catch (error) {
    console.error('GET bookmark error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookmark' }, { status: 500 });
  }
}

/**
 * PUT handler for updating an existing bookmark
 * Converts JSON body to FormData for compatibility with updateBookmark function
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'User ID missing' }, { status: 400 });

    const body = await req.json();
    
    // Convert JSON to FormData for updateBookmark compatibility
    const formData = new FormData();
    formData.append('title', body.title || '');
    formData.append('link', body.link || '');
    formData.append('tagsInput', body.tags?.join(', ') || '');
    
    // Add collections if present in request
    if (body.collections) {
      body.collections.forEach((col: string) => formData.append('collections', col));
    }

    await updateBookmark(id, formData, userId);

    return NextResponse.json({ message: 'Bookmark updated successfully' });
  } catch (error) {
    console.error('PUT bookmark error:', error);
    return NextResponse.json({ error: 'Failed to update bookmark' }, { status: 500 });
  }
}

/**
 * DELETE handler for removing a bookmark
 * Validates user ownership before deletion
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = req.nextUrl.searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'User ID missing' }, { status: 400 });

    const deleted = await deleteBookmark(id, userId);
    if (!deleted) return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 });

    return NextResponse.json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    console.error('DELETE bookmark error:', error);
    return NextResponse.json({ error: 'Failed to delete bookmark' }, { status: 500 });
  }
}