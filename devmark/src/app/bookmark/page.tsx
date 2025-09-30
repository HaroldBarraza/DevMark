import { getbookmark } from '@/app/lib/bookmarkaction/queris'
import {deletebookmark } from '@/app/lib/bookmarkaction/actionbookamarlk'
import type { bookmark } from '@/app/lib/types'
import Link from 'next/link'


function extractDomain(url: string){
  try{
    const domain = new URL(url).hostname;
    return domain.replace(/^www\./, '');
  }catch {
    return url;
  }
}

export default async function Home() {
  const bookmarks = await getbookmark();

  return (
    <div className='container mx-auto p-4'>
      <div className='bookmarks'>
        <h2 className='text-2xl font-bold mb-6' >Bookmarks</h2>
        <div className='create mb-6'>
          <Link href={`/bookmark/create`} className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors'>Create a BookMark</Link>
        </div>
        {bookmarks.length === 0 ? (
          <p className='text-gray-500 text-center py-8'>No BookMarks yet</p>
        ):(
          <div>
            <h3 className='text-x1 font-semibold mb-4'>All BookMarks</h3>
            <div className='space-x-4'>
              {bookmarks.map((bookmark: bookmark) => (
                <div  key={bookmark.id} className='border border-gray-200 rounded-xl p-5 bg-white hover:shadow-sm transition-all duration-200'>
                  <div className="flex justify-between items-start">
                    {/*imagen de url */}
                    {bookmark.image && bookmark.image !== '/default-icon.png' && (
                      <div className='flex-shrink-0'>
                        <img src={bookmark.image} alt={`logo de ${bookmark.image}}`} className='w-20 h-20 object-cover rounded-lg border border-gray-100' />
                      </div>
                    )}
                    {/* contenido principal*/}
                    <div className='flex-1 min-w-0'>
                      {/* titulo */}
                      <h3 className='text-lg font-semibold text-gray-900 mb-2 line-clamp-2'>
                        {bookmark.title}
                      </h3>
                      {/*url */}
                      <div className='flex items-center gap-3 text-xs text-gray-500'>
                        <div className='flex items-center gap-1'>
                          <span>{bookmark.link}</span>
                        <div className='flex items-center gap-1'>
                          <span className="font-medium">{extractDomain(bookmark.link)}</span>
                        </div>
                      </div>
                        {/* botones*/}
                        <div className="flex gap-2 flex-shrink-0 ml-4">
                          <form action={async() =>{
                            'use server';
                            await deletebookmark(bookmark.id);
                          }}>
                            <button type='submit' className='px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm'>🗑️</button>
                          </form>
                          <Link href={`/bookmark/edit/${bookmark.id}`} className='px-3 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors text-sm text-center inline-block'>Editar</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}