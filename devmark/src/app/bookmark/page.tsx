'use client';
import { useEffect, useState, useMemo } from 'react';
import { Bookmark } from '@/app/lib/types';
import { useUser } from '@/app/context/UserContext';
import Link from 'next/link';

/**
 * Main bookmarks page displaying user's saved bookmarks
 * Supports viewing, editing, deleting and searching bookmarks
 */
export default function BookmarksPage() {
  const { userId } = useUser();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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
   * Filters bookmarks based on search query across title, description, link, and tags
   */
  const filteredBookmarks = useMemo(() => {
    if (!searchQuery.trim()) return bookmarks;

    const query = searchQuery.toLowerCase().trim();
    
    return bookmarks.filter(bookmark => {
      // Search in title
      if (bookmark.title?.toLowerCase().includes(query)) return true;
      
      // Search in description
      if (bookmark.description?.toLowerCase().includes(query)) return true;
      
      // Search in link/URL
      if (bookmark.link?.toLowerCase().includes(query)) return true;
      
      // Search in tags
      if (bookmark.tags?.some(tag => 
        tag.name.toLowerCase().includes(query)
      )) return true;

      return false;
    });
  }, [bookmarks, searchQuery]);

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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Bookmarks</h2>
          
          {/* Create New Bookmark Button */}
          <Link
            href="/bookmark/create"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create a Bookmark
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search bookmarks by title, description, URL, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg 
                className="h-5 w-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
            
            {/* Clear search button */}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg 
                  className="h-5 w-5 text-gray-400 hover:text-gray-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            )}
          </div>
          
          {/* Search results info */}
          {searchQuery && (
            <div className="mt-2 text-sm text-gray-600">
              Found {filteredBookmarks.length} bookmark{filteredBookmarks.length !== 1 ? 's' : ''} 
              {filteredBookmarks.length !== bookmarks.length && 
                ` (of ${bookmarks.length} total)`
              }
            </div>
          )}
        </div>

        {/* Bookmarks List */}
        {bookmarks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No bookmarks yet</p>
            <Link
              href="/bookmark/create"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-block"
            >
              Create Your First Bookmark
            </Link>
          </div>
        ) : filteredBookmarks.length === 0 && searchQuery ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-2">No bookmarks found for "{searchQuery}"</p>
            <p className="text-gray-400 text-sm">
              Try searching by title, description, URL, or tags
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-blue-500 hover:text-blue-700 underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookmarks.map((bookmark: Bookmark) => (
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