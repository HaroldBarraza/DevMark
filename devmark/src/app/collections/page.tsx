"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { getCollectionsByUser, deleteCollection } from "@/app/lib/collections/collectionRepository";
import { Collection } from "@/app/lib/types";

export default function CollectionsPage() {
  const router = useRouter();
  const { userId } = useUser();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCollections() {
      if (!userId) return;
      try {
        const cols = await getCollectionsByUser(userId);
        setCollections(cols);
      } catch (err: unknown) {
        console.error("Error al obtener colecciones:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error desconocido");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchCollections();
  }, [userId]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta colección?")) return;
    try {
      await deleteCollection(id);
      setCollections(collections.filter((col) => col.id !== id));
    } catch (err: unknown) {
        console.error("Error al obtener colecciones:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error desconocido");
        }
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Colecciones</h1>
        <button
          onClick={() => router.push("/collections/collectionForm")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow"
        >
          + Nueva colección
        </button>
      </div>

      {loading ? (
        <p>Cargando colecciones...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : collections.length === 0 ? (
        <p>No tienes colecciones aún.</p>
      ) : (
        <ul className="space-y-3">
          {collections.map((col) => (
            <li
              key={col.id}
              className="flex justify-between items-center border p-4 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <span>{col.name}</span>

              <div className="space-x-2">

                <button onClick={() => router.push(`/collections/${col.id}/bookmarks`)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md">
                  Bookmarks
                </button>
                <button
                  onClick={() => router.push(`/collections/${col.id}/edit`)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(col.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
