// src/app/bookmark/create/page.tsx - VERSIÓN MEJORADA
'use client';
import { addBookmark } from '@/app/lib/bookmarkaction/actionbookamarlk';
import { useUser } from '@/app/context/UserContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function CreateBookmark() {
  const { userId } = useUser();
  const router = useRouter();
  const [tagsInput, setTagsInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Acción de crear bookmark
  async function createBookmarkAction(formData: FormData) {
    if (!userId) {
      alert('Debes iniciar sesión para crear bookmarks');
      return;
    }

    setLoading(true);
    try {
      // Agregar tags al formData (si el usuario los proporcionó)
      formData.append('tagsInput', tagsInput);
      
      await addBookmark(formData, userId);
      router.push('/bookmark');
    } catch (error) {
      console.error('Error creating bookmark:', error);
      alert('Error al crear el bookmark');
    } finally {
      setLoading(false);
    }
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">Debes iniciar sesión para crear bookmarks</p>
          <Link href="/auth/login" className="bg-blue-500 text-white px-4 py-2 rounded">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Bookmark</h1>
          <p className="text-gray-600">Enter a website URL to save as bookmark</p>
        </div>

        {/* Formulario */}
        <form action={createBookmarkAction} className="space-y-6">
          
          {/* Link - Campo principal y requerido */}
          <div>
            <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
              Website URL *
            </label>
            <input 
              type="url" 
              id="link"
              name="link" 
              placeholder="https://example.com" 
              required 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Tags - Opcional */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags (opcional)
            </label>
            <input
              type="text"
              id="tags"
              placeholder="Ej: trabajo, personal, programación, recetas"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
            <p className="text-sm text-green-600 mt-2">
              ✅ El título, descripción e imagen se obtendrán automáticamente
            </p>
          </div>
          {/* Botón de envío */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creando Bookmark...
              </>
            ) : (
              '➕ Add Bookmark'
            )}
          </button>
        </form>

        {/* Enlace de regreso */}
        <div className="mt-6 text-center">
          <Link 
            href="/bookmark" 
            className="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-2"
          >
            ← Back to Bookmarks
          </Link>
        </div>
      </div>
    </div>
  );
}