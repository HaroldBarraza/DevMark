import { getBookmarkById } from "@/app/lib/bookmarkaction/queris";
import { notFound } from "next/navigation";
import Link from "next/link";

/**
 * Page component for viewing detailed bookmark information
 * Server component that fetches and displays bookmark data
 */
export default async function View(props: { params: Promise<{ id: string }> }) {
  // Extract parameters (Next.js 15+ uses Promise for params)
  const params = await props.params;
  const id = params.id;
  
  // Fetch bookmark data from database
  const bookmark = await getBookmarkById(id);
  
  // Return 404 if bookmark not found
  if (!bookmark) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
        {/* Page Header */}
        <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">View Bookmark</h1>
            <p className="text-gray-600">Viewing bookmark details</p>
        </div>
        
        {/* Bookmark Information Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-start gap-4 mb-6">
                {/* Website Image/Logo */}
                {bookmark.image && bookmark.image !== '/default-icon.png' && (
                    <div className="flex-shrink-0">
                        <img 
                            src={bookmark.image} 
                            alt={`${bookmark.title} website logo`} 
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"/> 
                    </div>
                )}
                <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">{bookmark.title}</h2>
                    {/* External Website Link */}
                    <a 
                        href={bookmark.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:text-blue-800 text-lg font-medium block mb-3 break-all">
                        {bookmark.link}
                    </a>
                </div>
            </div>
        </div>
        
        {/* Description Section */}
        {bookmark.description && (
            <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {bookmark.description}
                </p>
            </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
            <Link 
                href="/bookmark" 
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium">
                Back to Bookmarks
            </Link>
            <Link 
                href={`/bookmark/edit/${bookmark.id}`} 
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
                Edit
            </Link>
        </div>
    </div>
  )
}