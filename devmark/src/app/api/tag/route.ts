import { NextRequest, NextResponse } from "next/server";
import { createTag, getTagsByUser } from "@/app/lib/tags/tagRepository";


export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json([], { status: 200 });
  
  const tags = await getTagsByUser(userId);
  return NextResponse.json(tags);
}
    
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, userId } = body;

    if (!name || !userId) 
      return NextResponse.json({ error: "Missing name or userId" }, { status: 400 });

    const tag = await createTag({ name, userId });
    return NextResponse.json(tag, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 });
  }
}
