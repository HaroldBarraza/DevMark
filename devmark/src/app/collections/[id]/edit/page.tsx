"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCollectionById, updateCollection } from "@/app/lib/collections/collectionRepository";

interface Props {
  params: { id: string };
}

export default function EditCollectionPage({ params }: Props) {
  const router = useRouter();
  const { id } = params;

  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCollection() {
      try {
        const col = await getCollectionById(id);
        setName(col.name);
        setIsPublic(col.isPublic);
      } catch (err) {
        console.error("Error al obtener colección:", err);
      }
    }
    fetchCollection();
  }, [id]);

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

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">Editar colección</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
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
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
