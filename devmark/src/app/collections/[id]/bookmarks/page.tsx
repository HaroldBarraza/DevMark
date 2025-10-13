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

/**
 * Page component for displaying bookmarks within a specific collection
 * Fetches and displays all bookmarks associated with the collection
 */
export default function CollectionBookmarksPage() {
  const params = useParams();
  const router = useRouter();
  const { id: collectionId } = params as { id: string };

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookmarks when collection ID is available
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

  // Show loading state while fetching data
  if (loading) return <p className="text-center mt-8">Loading bookmarks...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Page Header with Navigation */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Collection Bookmarks</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          onClick={() => router.back()}
        >
          Back
        </button>
      </div>

      {/* Bookmarks List */}
      {bookmarks.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No bookmarks in this collection.</p>
      ) : (
        <ul className="space-y-4">
          {bookmarks.map((bookmark) => (
            <li
              key={bookmark.id}
              className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                {/* Bookmark Content */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{bookmark.title}</h3>
                  <a
                    href={bookmark.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm block mb-2 break-all"
                  >
                    {bookmark.link}
                  </a>
                  {bookmark.description && (
                    <p className="text-gray-600 text-sm">{bookmark.description}</p>
                  )}
                </div>
                
                {/* Edit Action */}
                <Link
                  href={`/bookmark/edit/${bookmark.id}`}
                  className="bg-yellow-400 text-gray-900 px-3 py-2 rounded hover:bg-yellow-500 transition-colors ml-4 flex-shrink-0"
                >
                  Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}