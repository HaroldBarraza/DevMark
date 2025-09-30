import { addbookmark } from '@/app/lib/bookmarkaction/actionbookamarlk'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default function CreateBookmark() {
    async function createBookmarkAction(formData: FormData) {
        'use server'
        await addbookmark(formData)
        redirect('/bookmark')
    }

    return(
        <div className="max-w-lg mx-auto p-6 mt-12">
            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Bookmark</h1>
                <p className="text-gray-600">Enter a website URL to save as bookmark</p>
            </div>

            {/* Formulario */}
            <form action={createBookmarkAction} className="space-y-4">
                <div>
                    <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
                        Website URL
                    </label>
                    <input type="url" id="link"name="link" placeholder="https://example.com" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                </div>

                <button 
                    type="submit"
                    className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium">Add Bookmark</button>
            </form>

            {/* Enlace de regreso */}
            <div className="mt-6 text-center">
                <Link href="/bookmark" className="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-2">← Back to Bookmarks</Link>
            </div>
        </div>
    )
}