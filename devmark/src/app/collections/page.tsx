"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { getCollectionsByUser, deleteCollection } from "@/app/lib/collections/collectionRepository";
import { Collection } from "@/app/lib/types";

/**
 * CollectionsPage component for displaying and managing user collections
 * Shows all collections with options to view bookmarks, edit, or delete
 */
export default function CollectionsPage() {
  const router = useRouter();
  const { userId } = useUser();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user collections when component mounts or userId changes
  useEffect(() => {
    async function fetchCollections() {
      if (!userId) return;
      try {
        const userCollections = await getCollectionsByUser(userId);
        setCollections(userCollections);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error fetching collections');
      } finally {
        setLoading(false);
      }
    }
    fetchCollections();
  }, [userId]);

  /**
   * Handles collection deletion with confirmation
   * @param id - The ID of the collection to delete
   */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this collection?")) return;
    try {
      await deleteCollection(id);
      setCollections(collections.filter((collection) => collection.id !== id));
    } catch (err: unknown) {
      console.error('Error deleting collection:', err);
      alert("Failed to delete collection");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      {/* Page Header with Create Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Collections</h1>
        <button
          onClick={() => router.push("/collections/collectionForm")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow transition-colors"
        >
          + New Collection
        </button>
      </div>

      {/* Loading, Error, and Content States */}
      {loading ? (
        <p className="text-center text-gray-600 py-8">Loading collections...</p>
      ) : error ? (
        <p className="text-red-500 bg-red-50 p-4 rounded-lg border border-red-200">{error}</p>
      ) : collections.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">You don't have any collections yet.</p>
          <button
            onClick={() => router.push("/collections/collectionForm")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Create Your First Collection
          </button>
        </div>
      ) : (
        /* Collections List */
        <ul className="space-y-4">
          {collections.map((collection) => (
            <li
              key={collection.id}
              className="flex justify-between items-center border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              {/* Collection Name */}
              <span className="font-medium text-gray-900">{collection.name}</span>

              {/* Action Buttons */}
              <div className="space-x-2 flex">
                <button 
                  onClick={() => router.push(`/collections/${collection.id}/bookmarks`)} 
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md transition-colors text-sm"
                >
                  View Bookmarks
                </button>
                <button
                  onClick={() => router.push(`/collections/${collection.id}/edit`)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-md transition-colors text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(collection.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}