// src/app/bookmark/create/page.tsx
import { addbookmark } from '@/app/lib/bookmarkaction/actionbookamarlk'
import { redirect } from 'next/navigation'

export default function CreateBookmark() {
    async function createBookmarkAction(formData: FormData) {
        'use server'
        await addbookmark(formData)
        redirect('/bookmark')
    }

    return(
        <div className='container'>
            <div className='create'>
                <form action={createBookmarkAction}>
                    <p>Add BookMark</p>
                    <input type="text" name='title' placeholder='Input the title' required/>
                    <input type="url" name='link' placeholder='https://example.com' required />
                    <button type="submit">Add Bookmark</button>
                </form>
                
                <div style={{ marginTop: '20px' }}>
                    <a href="/bookmark">← Back to Bookmarks</a>
                </div>
            </div>
        </div>
    )
}