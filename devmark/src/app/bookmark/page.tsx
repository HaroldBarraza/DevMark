'use client';
import { useEffect, useState } from 'react';
import { Bookmark } from '@/app/lib/types';
import { useUser } from '@/app/context/UserContext';
import Link from 'next/link';

export default function BookmarksPage() {
  const { userId } = useUser();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  // Función para extraer dominio de la URL
  function extractDomain(url: string) {
    try {
      const domain = new URL(url).hostname;
      return domain.replace(/^www\./, '');
    } catch {
      return url;
    }
  }

  // Fetch bookmarks
  useEffect(() => {
    if (!userId) return;

    fetch(`/api/bookmarks?userId=${userId}`)
      .then(res => res.json())
      .then((data: Bookmark[]) => {
        setBookmarks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching bookmarks:', err);
        setLoading(false);
      });
  }, [userId]);

  // Función para borrar bookmark usando fetch a un endpoint API
  const handleDelete = async (id: number) => {
    if (!userId) return;

    const confirmed = confirm('¿Seguro que quieres borrar este bookmark?');
    if (!confirmed) return;

    try {
      await fetch('/api/bookmarks/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, userId }),
      });
      setBookmarks(bookmarks.filter(b => b.id !== id));
    } catch (err) {
      console.error('Error deleting bookmark:', err);
    }
  };

  if (!userId || loading) return <p className="text-center py-8">Cargando...</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="bookmarks">
        <h2 className="text-2xl font-bold mb-6">Bookmarks</h2>

        <div className="create mb-6">
          <Link
            href="/bookmark/create"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            + Create a Bookmark
          </Link>
        </div>

        {bookmarks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No bookmarks yet</p>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((bookmark: Bookmark) => (
              <div
                key={bookmark.id}
                className="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  {/* Contenido principal */}
                  <div className="flex gap-4 items-start flex-1">
                    {bookmark.image && bookmark.image !== '/default-icon.png' && (
                      <div className="flex-shrink-0">
                        <img
                          src={bookmark.image}
                          alt={`Logo de ${bookmark.title}`}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-100"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {bookmark.title}
                      </h3>

                      <a
                        href={bookmark.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm mb-2 block truncate"
                      >
                        {bookmark.link}
                      </a>

                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <span className="font-medium">{extractDomain(bookmark.link)}</span>
                      </div>

                      {bookmark.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                          {bookmark.description}
                        </p>
                      )}

                      {bookmark.tags && bookmark.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {bookmark.tags.map(tag => (
                            <span
                              key={tag.id}
                              className="bg-gray-200 px-2 py-1 rounded-full text-xs text-gray-700"
                            >
                              #{tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex gap-2 flex-shrink-0 ml-6 items-start">
                    <Link
                      href={`/bookmark/view/${bookmark.id}`}
                      className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                    >
                      👁️
                    </Link>

                    <Link
                      href={`/bookmark/edit/${bookmark.id}`}
                      className="px-3 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors text-sm"
                    >
                      ✏️
                    </Link>

                    <button
                      onClick={() => handleDelete(bookmark.id)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
