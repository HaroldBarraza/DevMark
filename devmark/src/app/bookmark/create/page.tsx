'use client';
import { addBookmark } from '@/app/lib/bookmarkaction/actionbookamarlk';
import { useUser } from '@/app/context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Collection = {
  id: string;
  name: string;
};

type Tag = {
  id: string;
  name: string;
};

export default function CreateBookmark() {
  const { userId } = useUser();
  const router = useRouter();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState('');

  // Traer collections
  useEffect(() => {
    if (!userId) return;
    fetch(`/api/collections?userId=${userId}`)
      .then(res => res.json())
      .then((data: Collection[]) => setCollections(data))
      .catch(err => console.error('Error fetching collections:', err));
  }, [userId]);

  // Acción de crear bookmark
  async function createBookmarkAction(formData: FormData) {
    if (!userId) throw new Error('User ID is missing');
    selectedCollections.forEach(id => formData.append('collections', id));
    formData.append('tagsInput', tagsInput);
    await addBookmark(formData, userId);
    router.push('/bookmark');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create a Bookmark</h2>
        <form action={createBookmarkAction} className="flex flex-col gap-4">

          {/* Title */}
          <label className="flex flex-col">
            <span className="mb-1 font-medium">Title</span>
            <input
              type="text"
              name="title"
              required
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter bookmark title"
            />
          </label>

          {/* Link */}
          <label className="flex flex-col">
            <span className="mb-1 font-medium">Link</span>
            <input
              type="url"
              name="link"
              required
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://example.com"
            />
          </label>

          {/* Collections */}
          <label className="flex flex-col">
            <span className="mb-1 font-medium">Collections</span>
            <select
              multiple
              value={selectedCollections}
              onChange={e =>
                setSelectedCollections(Array.from(e.target.selectedOptions, o => o.value))
              }
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32 overflow-y-auto"
              style={{ minWidth: '100%' }}
            >
              {collections.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>

          {/* Tags */}
          <label className="flex flex-col">
            <span className="mb-1 font-medium">Tags (separados por coma)</span>
            <input
              type="text"
              placeholder="Ej: work, personal, important"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Create Bookmark
          </button>

          {/* Back link */}
          <div className="mt-4 text-center">
            <Link
              href="/bookmark"
              className="text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              ← Back to Bookmarks
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
