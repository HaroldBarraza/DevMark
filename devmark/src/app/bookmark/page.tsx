import { getbookmark } from '@/app/lib/bookmarkaction/queris'
import { addbookmark, updatebookmark, deletebookmark } from '@/app/lib/bookmarkaction/actionbookamarlk';
import type { bookmark } from '@/app/lib/types'

export default async function Home() {
  const bookmarks = await getbookmark();

  return (
    <div className='container'>
      <div className='form-agenda'>
        <form action={addbookmark}>
          <p>Add Bookmark</p>
          <input type="text" name='title' placeholder='Title of the bookmark' required />
          <input type="text" name='link' placeholder='URL link' required />
          <button>Add Bookmark</button> 
        </form>
      </div>

      <div className='bookmarks'> 
        <h2>Bookmarks</h2>

        {bookmarks.length === 0 ? (
          <p>No bookmarks yet</p>
        ) : (
          <div>
            <h3 className="categoria-titulo">All Bookmarks</h3>
            <ul>
              {bookmarks.map((bookmark: bookmark) => (
                <li key={bookmark.id} className="bookmark-item">
                  <div className="bookmark-contenido"> 
                    
                    <div className="bookmark-info">
                      <h4>{bookmark.title}</h4>
                      <a href={bookmark.link} target="_blank" rel="noopener noreferrer">
                        {bookmark.link}
                      </a>
                    </div>

                    <div className="bookmark-actions">
                      <form action={async () => {
                        'use server';
                        await deletebookmark(bookmark.id);
                      }}>
                        <button type='submit' className='boton-delete'>🗑️ Delete</button>
                      </form>

                      <form action={async (formData: FormData) => {
                        'use server';
                        const title = formData.get('title') as string;
                        const link = formData.get('link') as string;
                        await updatebookmark(bookmark.id, title, link);
                      }}>
                        <input type="hidden" name="id" value={bookmark.id} />
                        <input type = "text" name="title" defaultValue={bookmark.title} required />
                        <input type = "url" name="link" defaultValue={bookmark.link} required />
                        <button type="submit">✏️ Edit</button>
                      </form>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}