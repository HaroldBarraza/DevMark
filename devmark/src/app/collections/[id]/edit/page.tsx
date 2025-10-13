"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCollectionById, updateCollection } from "@/app/lib/collections/collectionRepository";

/**
 * EditCollectionPage component for modifying existing collection details
 * Handles loading collection data and updating name/visibility settings
 */
export default function EditCollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Extract collection ID from params (Next.js 15+ uses Promise for params)
  useEffect(() => {
    async function getParams() {
      const { id } = await params;
      setId(id);
    }
    getParams();
  }, [params]);

  // Fetch collection data when ID becomes available
  useEffect(() => {
    async function fetchCollection() {
      if (!id) return;
      
      try {
        const collection = await getCollectionById(id);
        setName(collection.name);
        setIsPublic(collection.isPublic);
      } catch (error) {
        console.error("Error fetching collection:", error);
      } finally {
        setInitialLoading(false);
      }
    }
    fetchCollection();
  }, [id]);

  /**
   * Handles form submission for updating collection
   * @param e - Form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateCollection(id, { name, isPublic });
      router.push("/collections");
    } catch (error) {
      console.error("Error updating collection:", error);
      setLoading(false);
    }
  };

  // Show loading state while fetching initial data
  if (initialLoading) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white shadow rounded mt-8">
        <p className="text-center">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded mt-8">
      {/* Page Header */}
      <h1 className="text-xl font-bold mb-4">Edit Collection</h1>
      
      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Collection Name Input */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Collection name"
          required
        />
        
        {/* Public Visibility Toggle */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700">Make collection public</span>
        </label>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !id}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}