'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/app/context/UserContext';
import { Bookmark } from '@/app/lib/types';

export default function TagBookmarksPage() {
  const params = useParams();
  const tagId = params.id as string;
  const { userId } = useUser();
  
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [tagName, setTagName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !tagId) return;

    // Fetch tag info
    fetch(`/api/tag/${tagId}`)
      .then(res => res.json())
      .then(data => setTagName(data.name))
      .catch(err => console.error('Error fetching tag:', err));

    // Fetch bookmarks with this tag
    fetch(`/api/tag/${tagId}/bookmarks?userId=${userId}`)
      .then(res => res.json())
      .then((data: Bookmark[]) => {
        setBookmarks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching bookmarks:', err);
        setLoading(false);
      });
  }, [userId, tagId]);

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link 
          href="/bookmark" 
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Volver a todos los bookmarks
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">
          Bookmarks con etiqueta: <span className="text-indigo-600">{tagName}</span>
        </h1>
        <p className="text-gray-600">
          {bookmarks.length} {bookmarks.length === 1 ? 'bookmark' : 'bookmarks'}
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">No hay bookmarks con esta etiqueta</p>
        </div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {bookmarks.map(bookmark => (
            <li
              key={bookmark.id}
              style={{
                border: '1px solid #ddd',
                padding: '15px',
                margin: '10px 0',
                borderRadius: '5px',
                backgroundColor: 'white'
              }}
            >
              {/* Imagen del bookmark */}
                {bookmark.image && bookmark.image !== '/default-icon.png' && (
                <div className="flex-shrink-0">
                  <img
                    src={bookmark.image}  
                    alt={`Logo de ${bookmark.title}`}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-100"/>
                    </div>
                  )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0' }}>{bookmark.title}</h4>
                  <a 
                    href={bookmark.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {bookmark.link}
                  </a>
                  <p style={{ margin: '5px 0 0 0', color: '#555' }}>
                    {bookmark.description}
                  </p>

                  {/* Tags */}
                  {bookmark.tags && bookmark.tags.length > 0 && (
                    <div style={{ marginTop: '8px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      {bookmark.tags.map(tag => (
                        <span
                          key={tag.id}
                          style={{
                            backgroundColor: tag.id === tagId ? '#818cf8' : '#e0e0e0',
                            color: tag.id === tagId ? 'white' : '#333',
                            padding: '2px 6px',
                            borderRadius: '12px',
                            fontSize: '12px'
                          }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <form action={`/api/bookmarks/delete/${bookmark.id}`} method="POST">
                    <button
                      type="submit"
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </form>

                  <Link
                    href={`/bookmark/edit/${bookmark.id}`}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#ffc107',
                      color: 'black',
                      textDecoration: 'none',
                      borderRadius: '3px',
                      display: 'inline-block'
                    }}
                  >
                    ✏️ Edit
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}