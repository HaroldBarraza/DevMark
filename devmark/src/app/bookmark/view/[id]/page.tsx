// src/app/bookmark/view/[id]/page.tsx - CORREGIDO
import { getBookmarkById } from "@/app/lib/bookmarkaction/queris";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function View(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id; // ✅ Usa el string directamente
  
  const bookmark = await getBookmarkById(id);
  
  if (!bookmark) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">View Bookmark</h1>
            <p className="text-gray-600">Viewing bookmark details</p>
        </div>
        
        {/* Información del bookmark */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-start gap-4 mb-6">
                {/* Imagen del sitio */}
                {bookmark.image && bookmark.image !== '/default-icon.png' && (
                    <div className="flex-shrink-0">
                        <img src={bookmark.image} alt={`logo de ${bookmark.title}`} className="w-16 h-16 object-cover rounded-lg border border-gray-200"/> 
                    </div>
                )}
                <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">{bookmark.title}</h2>
                    {/* Link de la página */}
                    <a href={bookmark.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-lg font-medium block mb-3 break-all">
                        {bookmark.link}
                    </a>
                </div>
            </div>
        </div>
        
        {/* Descripción */}
        {bookmark.description && (
            <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {bookmark.description}
                </p>
            </div>
        )}
        
        {/* Botones */}
        <div className="flex gap-3 justify-end">
            <Link href="/bookmark" className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium">
                ← Back to Bookmarks
            </Link>
            <Link href={`/bookmark/edit/${bookmark.id}`} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
                Edit
            </Link>
        </div>
    </div>
  )
}