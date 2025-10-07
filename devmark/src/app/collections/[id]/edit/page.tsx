"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCollectionById, updateCollection } from "@/app/lib/collections/collectionRepository";

// ✅ CORRECTO: params es Promise en Next.js 15
export default function EditCollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string>(""); // ✅ Estado para el ID
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // ✅ Estado para carga inicial

  // ✅ Obtener el ID de los params con await
  useEffect(() => {
    async function getParams() {
      const { id } = await params; // ← await aquí
      setId(id);
    }
    getParams();
  }, [params]);

  // ✅ Fetch collection data cuando tengamos el ID
  useEffect(() => {
    async function fetchCollection() {
      if (!id) return; // ✅ Esperar hasta tener el ID
      
      try {
        const col = await getCollectionById(id);
        setName(col.name);
        setIsPublic(col.isPublic);
      } catch (err) {
        console.error("Error al obtener colección:", err);
      } finally {
        setInitialLoading(false); // ✅ Finalizar carga inicial
      }
    }
    fetchCollection();
  }, [id]); // ✅ Dependencia en el ID, no en params

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateCollection(id, { name, isPublic });
      router.push("/collections");
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // ✅ Mostrar loading mientras obtenemos los datos iniciales
  if (initialLoading) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white shadow rounded mt-8">
        <p className="text-center">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded mt-8">
      <h1 className="text-xl font-bold mb-4">Editar colección</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Nombre de la colección"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          <span>Hacer pública</span>
        </label>
        <button
          type="submit"
          disabled={loading || !id} // ✅ Deshabilitar si no hay ID
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}