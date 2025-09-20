"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    setError("");

    if (!displayName || !email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    setLoading(true);

    // 1️⃣ Crear usuario en Supabase Auth con displayName en los metadatos
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName, // 👈 Guardamos el nombre en user_metadata
          provider: "LOCAL",
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const userId = data.user?.id;
    if (!userId) {
      setError("Error al crear usuario");
      setLoading(false);
      return;
    }

    // 2️⃣ Crear perfil en tabla profiles
    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      name: displayName, // 👈 ahora sí lo usamos para el profile
      role: "USER",
      provider: "LOCAL",
      emailverified: false,
      bookmarks: JSON.stringify([]),
      collections: JSON.stringify([]),
      createdat: new Date().toISOString(),
      updatedat: new Date().toISOString(),
    });

    setLoading(false);

    if (profileError) {
      setError(profileError.message);
    } else {
      alert("Registro exitoso! Revisa tu correo para confirmar tu cuenta.");
      router.push("/auth/login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Registrarse</h1>
        <input
          type="text"
          placeholder="Nombre completo"
          className="border p-2 w-full mb-4 rounded"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="border p-2 w-full mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </div>
    </div>
  );
}
