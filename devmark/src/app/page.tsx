"use client";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Check user session and profile on component mount
  useEffect(() => {
    const checkSession = async () => {
      // Get current session from Supabase
      const { data: { session } } = await supabase.auth.getSession();

      // Redirect to login if no session exists
      if (!session) {
        router.push("/auth/login");
        return;
      }

      try {
        // Fetch user profile data from database
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("name, email")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;

        // Set user name from profile or fallback to email
        setUserName(profileData?.name || session.user.email || "User");
      } catch (error) {
        console.error("Error fetching profile:", error);
        // Fallback to email if profile fetch fails
        setUserName(session.user.email || "User");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  // Show loading state while checking session
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome, {userName}!</h1>
      
      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Bookmarks Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-3">📚 Your Bookmarks</h2>
          <p className="text-gray-600 mb-4">Manage all your saved links</p>
          <button 
            onClick={() => router.push("/bookmark")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            View Bookmarks
          </button>
        </div>

        {/* Collections Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-3">🗂️ Collections</h2>
          <p className="text-gray-600 mb-4">Organize by categories</p>
          <button 
            onClick={() => router.push("/collections")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            View Collections
          </button>
        </div>

        {/* Tags Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-3">🏷️ Tags</h2>
          <p className="text-gray-600 mb-4">Find by tags</p>
          <button 
            onClick={() => router.push("/bookmark")}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Explore Tags
          </button>
        </div>
      </div>
    </div>
  );
}