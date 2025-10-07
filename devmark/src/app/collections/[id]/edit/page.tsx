'use client';
import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  getCollectionById,
  updateCollection,
} from '@/app/lib/collections/collectionRepository';

export default function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();

  const [resolvedId, setResolvedId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);

  // Resolver el parámetro dinámico
  useEffect(() => {
    params.then(({ id }) => setResolvedId(id));
  }, [params]);

  // Obtener datos de la colección
  useEffect(() => {
    if (!resolvedId) return;

    const fetchCollection = async () => {
      try {
        const col = await getCollectionById(resolvedId);
        setName(col.name);
        setIsPublic(col.isPublic);
      } catch (err) {
        console.error('Error al obtener colección:', err);
      }
    };

    fetchCollection();
  }, [resolvedId]);

  // Enviar cambios
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resolvedId) return;

    setLoading(true);

    try {
      await updateCollection(resolvedId, { name, isPublic });
      router.push('/collections');
    } catch (err) {
      console.error('Error al actualizar colección:', err);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded mt-10">
      <h1 className="text-xl font-bold mb-4">Editar colección</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la colección
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Visibilidad */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="accent-blue-600"
            />
            <span className="text-sm text-gray-700">Hacer pública</span>
          </label>
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}
