// src/app/api/bookmarks/route.ts - COMPLETO
import { NextRequest, NextResponse } from 'next/server';
import { getBookmarksByUserWithTags } from '@/app/lib/bookmarkaction/queris';
import { addBookmark } from '@/app/lib/bookmarkaction/actionbookamarlk';
import { supabase } from '@/app/lib/supabaseClient';

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

export async function POST(req: NextRequest) {
  try {
    // Obtener el usuario autenticado desde Supabase
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      // Verificar el token con Supabase
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error) {
        console.error('Error verifying token:', error);
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
      
      if (user) {
        userId = user.id;
      }
    }

    // Si no hay usuario autenticado, retornar error
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parsear el FormData
    const formData = await req.formData();
    
    // Crear el bookmark usando tu función existente
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