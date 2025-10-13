"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";

/**
 * NewCollectionPage component for creating new collections
 * Allows users to create collections with name and visibility settings
 */
export default function NewCollectionPage() {
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userId } = useUser();
  const [error, setError] = useState("");
  const router = useRouter();

  /**
   * Handles form submission for creating a new collection
   * Validates input and sends create request to API
   * @param e - Form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate required fields
    if (!name) {
      setError("Collection name is required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          isPublic,
          userId: userId, 
        }),
      });

      if (!res.ok) throw new Error("Failed to create collection");
      
      // Redirect to collections page on success
      router.push("/collections");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-lg mt-8">
      {/* Page Header */}
      <h1 className="text-xl font-bold mb-4 text-gray-900">New Collection</h1>
      
      {/* Collection Creation Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Collection Name Input */}
        <input
          type="text"
          placeholder="Collection name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          required
        />
        
        {/* Public Visibility Toggle */}
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700 select-none">Make collection public</span>
        </label>

        {/* Error Message Display */}
        {error && (
          <p className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-200">
            {error}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? "Creating..." : "Create Collection"}
        </button>
      </form>
    </div>
  );
}