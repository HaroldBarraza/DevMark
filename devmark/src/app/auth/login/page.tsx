"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";

/**
 * Login page component for user authentication
 * Handles email/password login with Supabase Auth
 */
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Redirect to home if user is already authenticated
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) router.push("/");
    };
    checkSession();
  }, [router]);

  /**
   * Handles user login with email and password
   * Validates inputs and authenticates via Supabase
   */
  const handleLogin = async () => {
    setError("");

    // Validate form inputs
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    // Attempt login with Supabase Auth
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (loginError) {
      setError(loginError.message);
    } else {
      // Redirect to home page on successful login
      router.push("/");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      {/* Login Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        {/* Form Header */}
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
        
        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        {/* Error Message Display */}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-gray-800 text-white w-full py-2 rounded hover:bg-gray-900 disabled:opacity-50 transition-colors"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}