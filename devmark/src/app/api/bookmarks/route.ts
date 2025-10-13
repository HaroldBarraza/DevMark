import { NextRequest, NextResponse } from 'next/server';
import { getBookmarksByUserWithTags } from '@/app/lib/bookmarkaction/queris';
import { addBookmark } from '@/app/lib/bookmarkaction/actionbookamarlk';
import { supabase } from '@/app/lib/supabaseClient';

/**
 * GET handler for retrieving all bookmarks for a specific user
 * Returns empty array if no user ID provided
 */
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    
    // Return empty array if no user ID provided
    if (!userId) return NextResponse.json([], { status: 200 });

    const bookmarks = await getBookmarksByUserWithTags(userId);
    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error('GET bookmarks error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 });
  }
}

/**
 * POST handler for creating a new bookmark
 * Requires authentication via Supabase JWT token
 * Processes FormData to create bookmark with automatic metadata extraction
 */
export async function POST(req: NextRequest) {
  try {
    // Extract authentication token from Authorization header
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;

    // Verify JWT token with Supabase
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      // Validate token with Supabase Auth
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error) {
        console.error('Error verifying token:', error);
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
      
      if (user) {
        userId = user.id;
      }
    }

    // Return unauthorized if no valid user found
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse form data from request
    const formData = await req.formData();
    
    // Create bookmark using existing function
    await addBookmark(formData, userId);

    return NextResponse.json({ 
      success: true, 
      message: 'Bookmark created successfully' 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating bookmark:', error);
    return NextResponse.json(
      { error: 'Failed to create bookmark' }, 
      { status: 500 }
    );
  }
}