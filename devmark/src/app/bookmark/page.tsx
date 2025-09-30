'use client';
import { useEffect, useState } from 'react';
import { Bookmark } from '@/app/lib/types';
import Link from 'next/link';
import { useUser } from '@/app/context/UserContext';

export default function Home() {
  const { userId } = useUser();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    // Consumimos la API route del servidor
    fetch(`/api/bookmarks/${userId}`)
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

  if (!userId || loading) return <p>Cargando...</p>;

  return (
    <div className='container'>
      <div className='bookmarks'> 
        <h2>Bookmarks</h2>
        <div className='create'>
          <Link href={`/bookmark/create`}>Create a BookMark</Link>
        </div>

        {bookmarks.length === 0 ? (
          <p>No bookmarks yet</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {bookmarks.map((bookmark) => (
              <li key={bookmark.id} style={{ 
                border: '1px solid #ddd', 
                padding: '15px', 
                margin: '10px 0',
                borderRadius: '5px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}> 
                  <div>
                    <h4 style={{ margin: '0 0 5px 0' }}>{bookmark.title}</h4>
                    <a href={bookmark.link} target="_blank" rel="noopener noreferrer">
                      {bookmark.link}
                    </a>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <form action={`/api/bookmarks/delete/${bookmark.id}`} method="POST">
                      <button type='submit' style={{ 
                        padding: '5px 10px', 
                        backgroundColor: '#dc3545', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}>
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
                      }}>✏️ Edit</Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
