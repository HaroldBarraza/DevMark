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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Bookmark</h1>
        <p className="text-gray-600">Update your bookmark information</p>
      </div>
  
      <form action={async (formData: FormData) => {
        'use server'
        const title = formData.get('title') as string;
        const link = formData.get('link') as string;
        const description = formData.get('description') as string;
        await updatebookmark(id, title, link, description);
        redirect('/bookmark');
      }}>
    
    {/* Campo Title */}
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input type="text" id="title"name="title" defaultValue={bookmark.title} required placeholder="Enter bookmark title"className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"/>
      </div>
    
    {/* Campo URL */}
      <div className="mb-6">
        <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
        URL *
        </label>
        <input type="url" id="link"name="link" defaultValue={bookmark.link} required placeholder="https://example.com"className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"/>
      </div>

    {/* Campo Description */}
      <div className="mb-8">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea id="description"name="description" defaultValue={bookmark.description} rows={4}placeholder="Optional description for your bookmark"className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"/>
      </div>

    {/* Botones */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button type="submit" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2 shadow-sm">
          💾 Save Changes
        </button>

        <a href="/bookmark"className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center gap-2">
          ❌ Cancel
        </a>
      </div>
    </form>
  </div>
  )
}