"use client";
import { useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";

/**
 * Registration page component for new user sign-up
 * Handles user registration with Supabase Auth and profile creation
 */
export default function RegisterPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /**
   * Handles user registration process
   * Creates auth user and associated profile in database
   */
  const handleRegister = async () => {
    setError("");

    // Validate all form fields are filled
    if (!displayName || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    // Create user in Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          provider: "LOCAL",
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Extract user ID from auth response
    const userId = data.user?.id;
    if (!userId) {
      setError("Error creating user account");
      setLoading(false);
      return;
    }

    // Create user profile in database
    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      name: displayName,
      role: "USER",
      provider: "LOCAL",
      providerId: null,
      emailVerified: false,
      image: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    });

    setLoading(false);

    if (profileError) {
      setError(profileError.message);
    } else {
      alert("Registration successful! Please check your email to confirm your account.");
      router.push("/auth/login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      {/* Registration Form Container */}
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
        {/* Header Section */}
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          Create your account
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Join our community in seconds
        </p>

        {/* Registration Form */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full name"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Error Message Display */}
        {error && (
          <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
        )}

        {/* Submit Button */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="mt-6 w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-xl font-semibold shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Registering..." : "Sign Up"}
        </button>

        {/* Login Redirect */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/auth/login")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}