'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/app/context/UserContext';
import { Bookmark } from '@/app/lib/types';

/**
 * Page component that displays all bookmarks associated with a specific tag
 * Shows tag information and filtered bookmarks with actions
 */
export default function TagBookmarksPage() {
  const params = useParams();
  const tagId = params.id as string;
  const { userId } = useUser();
  
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [tagName, setTagName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Fetch tag information and associated bookmarks
  useEffect(() => {
    if (!userId || !tagId) return;

    // Fetch tag details
    fetch(`/api/tag/${tagId}`)
      .then(res => res.json())
      .then(data => setTagName(data.name))
      .catch(err => console.error('Error fetching tag:', err));

    // Fetch bookmarks with this specific tag
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

  // Show loading state while fetching data
  if (loading) return <p className="text-center py-8">Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      {/* Page Header */}
      <div className="mb-6">
        <Link 
          href="/bookmark" 
          className="text-blue-600 hover:underline mb-4 inline-block transition-colors"
        >
          ← Back to all bookmarks
        </Link>
        
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          Bookmarks with tag: <span className="text-indigo-600">{tagName}</span>
        </h1>
        <p className="text-gray-600">
          {bookmarks.length} {bookmarks.length === 1 ? 'bookmark' : 'bookmarks'} found
        </p>
      </div>

      {/* Bookmarks List */}
      {bookmarks.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">No bookmarks found with this tag</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {bookmarks.map(bookmark => (
            <li
              key={bookmark.id}
              className="border border-gray-200 p-4 rounded-lg bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Bookmark Thumbnail */}
                {bookmark.image && bookmark.image !== '/default-icon.png' && (
                  <div className="flex-shrink-0">
                    <img
                      src={bookmark.image}  
                      alt={`${bookmark.title} website logo`}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-100"
                    />
                  </div>
                )}
                
                {/* Bookmark Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 mb-2">{bookmark.title}</h4>
                  <a 
                    href={bookmark.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm block mb-2 break-all"
                  >
                    {bookmark.link}
                  </a>
                  {bookmark.description && (
                    <p className="text-gray-600 text-sm mb-3">
                      {bookmark.description}
                    </p>
                  )}

                  {/* Tags Display */}
                  {bookmark.tags && bookmark.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {bookmark.tags.map(tag => (
                        <span
                          key={tag.id}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tag.id === tagId 
                              ? 'bg-indigo-500 text-white' 
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-shrink-0">
                  <Link
                    href={`/bookmark/edit/${bookmark.id}`}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-2 rounded text-sm transition-colors"
                  >
                    Edit
                  </Link>
                  
                  <form action={`/api/bookmarks/delete/${bookmark.id}`} method="POST">
                    <button
                      type="submit"
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}