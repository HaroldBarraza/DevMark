'use client';
import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/context/UserContext';

type Tag = { id: string; name: string };
type Bookmark = {
  id: string;
  title: string;
  link: string;
  description?: string;
  tags?: Tag[];
};

export default function EditBookmark({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = useUser();
  const router = useRouter();

  const [bookmark, setBookmark] = useState<Bookmark | null>(null);
  const [loading, setLoading] = useState(true);
  const [tagsInput, setTagsInput] = useState('');
  const [resolvedId, setResolvedId] = useState<string | null>(null);

  // Resolver params.id
  useEffect(() => {
    params.then(({ id }) => setResolvedId(id));
  }, [params]);

  // Fetch bookmark data
  useEffect(() => {
    if (!userId || !resolvedId) return;

    const fetchBookmark = async () => {
      try {
        const res = await fetch(`/api/bookmarks/${resolvedId}?userId=${userId}`);
        const data = await res.json();
        if (!res.ok) {
          console.error('API error:', data);
          return;
        }
        setBookmark(data);
        setTagsInput(data.tags?.map((t: Tag) => t.name).join(', ') || '');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmark();
  }, [resolvedId, userId]);

  if (loading) return <p className="text-center text-gray-600 mt-8">Cargando...</p>;
  if (!bookmark) return <p className="text-center text-red-500 mt-8">Bookmark no encontrado</p>;

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId || !resolvedId) return;

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const link = formData.get('link') as string;
    const description = formData.get('description') as string;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch(`/api/bookmarks/${resolvedId}?userId=${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, link, description, tags }),
      });
      if (!res.ok) throw new Error('Error updating bookmark');
      router.push('/bookmark');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-200 mt-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Bookmark</h1>
        <p className="text-gray-600">Update your bookmark information</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={bookmark.title}
            required
            placeholder="Enter bookmark title"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>

        {/* Link */}
        <div className="mb-6">
          <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
            URL *
          </label>
          <input
            type="url"
            id="link"
            name="link"
            defaultValue={bookmark.link}
            required
            placeholder="https://example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={bookmark.description}
            rows={4}
            placeholder="Optional description for your bookmark"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
          />
        </div>

        {/* Tags */}
        <div className="mb-8">
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags (separated by commas)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={tagsInput}
            onChange={e => setTagsInput(e.target.value)}
            placeholder="e.g. work, personal, design"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2 shadow-sm"
          >
            💾 Save Changes
          </button>

          <a
            href="/bookmark"
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center gap-2"
          >
            ❌ Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
