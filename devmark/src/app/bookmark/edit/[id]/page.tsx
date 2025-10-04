'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/context/UserContext';

type Tag = { id: string; name: string };
type Bookmark = {
  id: string;
  title: string;
  link: string;
  tags?: Tag[];
};

export default function EditBookmark({ params }: { params: { id: string } }) {
  const { userId } = useUser();
  const id = params.id; // uuid from the URL
  const router = useRouter();

  const [bookmark, setBookmark] = useState<Bookmark | null>(null);
  const [loading, setLoading] = useState(true);
  const [tagsInput, setTagsInput] = useState('');

  // Fetch bookmark data
  useEffect(() => {
    if (!userId || !id) return; // evita fetch prematuro

    const fetchBookmark = async () => {
      try {
        const res = await fetch(`/api/bookmarks/${id}?userId=${userId}`);
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
  }, [id, userId]);



  if (loading) return <p>Cargando...</p>;
  if (!bookmark) return <p>Bookmark no encontrado</p>;

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) return;

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const link = formData.get('link') as string;

    // Convert tags input into array
    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch(`/api/bookmarks/${id}?userId=${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, link, tags }),
      });
      if (!res.ok) throw new Error('Error updating bookmark');
      router.push('/bookmark');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Edit Bookmark</h1>

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={bookmark.title}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Link */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="link">URL:</label>
          <input
            type="url"
            id="link"
            name="link"
            defaultValue={bookmark.link}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Tags */}
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="tags">Tags (separados por coma):</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={tagsInput}
            onChange={e => setTagsInput(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            💾 Save Changes
          </button>
          <a
            href="/bookmark"
            style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', textDecoration: 'none', borderRadius: '4px' }}
          >
            ❌ Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
