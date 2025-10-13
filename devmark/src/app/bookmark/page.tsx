'use client';
import { useEffect, useState } from 'react';
import { Bookmark } from '@/app/lib/types';
import { useUser } from '@/app/context/UserContext';
import Link from 'next/link';

/**
 * Main bookmarks page displaying user's saved bookmarks
 * Supports viewing, editing, and deleting bookmarks
 */
export default function BookmarksPage() {
  const { userId } = useUser();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Extracts domain name from URL for display purposes
   * @param url - The full URL to extract domain from
   * @returns Clean domain name without www prefix
   */
  function extractDomain(url: string) {
    try {
      const domain = new URL(url).hostname;
      return domain.replace(/^www\./, '');
    } catch {
      return url;
    }
  }

  // Fetch user's bookmarks when component mounts
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

  /**
   * Handles bookmark deletion with confirmation
   * @param id - The ID of the bookmark to delete
   */
  const handleDelete = async (id: string) => {
    if (!userId) return;

    const confirmed = confirm('Are you sure you want to delete this bookmark?');
    if (!confirmed) return;

    try {
      await fetch(`/api/bookmarks/${id}?userId=${userId}`, {
        method: 'DELETE',
      });
      setBookmarks(bookmarks.filter(b => b.id !== id));
    } catch (err) {
      console.error('Error deleting bookmark:', err);
      alert('Error deleting bookmark');
    }
  };

  // Show loading state while fetching data
  if (!userId || loading) return <p className="text-center py-8">Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="bookmarks">
        {/* Page Header */}
        <h2 className="text-2xl font-bold mb-6">Bookmarks</h2>

        {/* Create New Bookmark Button */}
        <div className="create mb-6">
          <Link
            href="/bookmark/create"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create a Bookmark
          </Link>
        </div>

        {/* Bookmarks List */}
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
                  {/* Main Content */}
                  <div className="flex gap-4 items-start flex-1">
                    {/* Website Thumbnail */}
                    {bookmark.image && bookmark.image !== '/default-icon.png' && (
                      <div className="flex-shrink-0">
                        <img
                          src={bookmark.image}
                          alt={`${bookmark.title} website logo`}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-100"
                        />
                      </div>
                    )}

                    {/* Bookmark Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {bookmark.title}
                      </h3>

                      {/* External Link */}
                      <a
                        href={bookmark.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm mb-2 block truncate">
                        {bookmark.link}
                      </a>

                      {/* Domain Information */}
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <span className="font-medium">{extractDomain(bookmark.link)}</span>
                      </div>

                      {/* Description */}
                      {bookmark.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                          {bookmark.description}
                        </p>
                      )}

                      {/* Tags */}
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

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-shrink-0 ml-6 items-start">
                    <Link
                      href={`/bookmark/view/${bookmark.id}`}
                      className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                      title="View details">View</Link>

                    <Link
                      href={`/bookmark/edit/${bookmark.id}`}
                      className="px-3 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors text-sm"
                      title="Edit bookmark">Edit</Link>

                    <button
                      onClick={() => handleDelete(bookmark.id)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                      title="Delete bookmark">Delete</button>
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