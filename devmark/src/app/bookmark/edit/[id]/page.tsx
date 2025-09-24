// src/app/bookmark/edit/[id]/page.tsx
import { getbookmarkById } from '@/app/lib/bookmarkaction/queris'
import { updatebookmark } from '@/app/lib/bookmarkaction/actionbookamarlk'
import { notFound, redirect } from 'next/navigation'

export default async function EditPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = parseInt(params.id);
  
  const bookmark = await getbookmarkById(id);
  
  if (!bookmark) {
    notFound();
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Edit Bookmark</h1>
      <p>Editing bookmark ID: {id}</p>
      
      <div style={{ 
        backgroundColor: '#000000ff', 
        padding: '15px', 
        marginBottom: '20px',
        borderRadius: '5px'
      }}>
        <h3>Current Bookmark</h3>
        <p><strong>Title:</strong> {bookmark.title}</p>
        <p><strong>URL:</strong> {bookmark.link}</p>
      </div>

      <form action={async (formData: FormData) => {
        'use server'
        const title = formData.get('title') as string;
        const link = formData.get('link') as string;
        await updatebookmark(id, title, link);
        redirect('/bookmark');
      }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '5px' }}>
            Title:
          </label>
          <input 
            type="text" 
            id="title"
            name="title" 
            defaultValue={bookmark.title} 
            required 
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="link" style={{ display: 'block', marginBottom: '5px' }}>
            URL:
          </label>
          <input 
            type="url" 
            id="link"
            name="link" 
            defaultValue={bookmark.link} 
            required 
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>

        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="submit"
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}>💾 Save Changes</button>
          
          <a 
            href="/bookmark"
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#6c757d', 
              color: 'white', 
              textDecoration: 'none',
              borderRadius: '4px'
            }}>❌ Cancel</a>
        </div>
      </form>
    </div>
  )
}