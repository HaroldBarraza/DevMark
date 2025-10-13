import { NextRequest, NextResponse } from "next/server";
import { createTag, getTagsByUser } from "@/app/lib/tags/tagRepository";

/**
 * GET handler for retrieving all tags for a specific user
 * Returns empty array if no user ID provided
 */
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    
    // Return empty array if no user ID provided
    if (!userId) return NextResponse.json([], { status: 200 });

    const tags = await getTagsByUser(userId);
    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json([], { status: 500 });
  }
}

/**
 * POST handler for creating a new tag
 * Requires tag name and user ID in request body
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, userId } = body;

    // Validate required fields
    if (!name || !userId) {
      return NextResponse.json(
        { error: "Tag name and user ID are required" }, 
        { status: 400 }
      );
    }

    // Create tag with proper field mapping
    const tag = await createTag({
      name,
      user_id: userId  // Map to database column name
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { error: "Failed to create tag" }, 
      { status: 500 }
    );
  }
}