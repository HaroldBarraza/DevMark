'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type Bookmark = {
  id: number;
  title: string;
  link: string;
  description: string | null;
  image: string | null;
};

export default function CollectionBookmarksPage() {
  const params = useParams();
  const router = useRouter();
  const { id: collectionId } = params as { id: string };

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!collectionId) return;

    fetch(`/api/collections/${collectionId}/bookmarks`)
      .then((res) => res.json())
      .then((data: Bookmark[]) => {
        setBookmarks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching collection bookmarks:', err);
        setLoading(false);
      });
  }, [collectionId]);

  if (loading) return <p className="text-center mt-8">Cargando bookmarks...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bookmarks de la colección</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => router.back()}
        >
          ← Volver
        </button>
      </div>

      {bookmarks.length === 0 ? (
        <p>No hay bookmarks en esta colección.</p>
      ) : (
        <ul className="space-y-4">
          {bookmarks.map((b) => (
            <li
              key={b.id}
              className="border p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{b.title}</h3>
                <a
                  href={b.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  {b.link}
                </a>
                {b.description && <p className="text-gray-600">{b.description}</p>}
              </div>
              <Link
                href={`/bookmark/edit/${b.id}`}
                className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
              >
                Editar
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
