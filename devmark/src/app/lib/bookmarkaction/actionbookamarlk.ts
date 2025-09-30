'use server'

import sql from '@/app/lib/databse'
import { revalidatePath } from 'next/cache'


// extraer oinformacion de la pagina

function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  return 'http://localhost:3000';
}

// extraer informacion de la pagina
async function scrapWebData(url: string) {
    try {
        // ✅ URL absoluta usando la función automática
        const baseUrl = getBaseUrl();
        const apiUrl = `${baseUrl}/api/scrape`;
        
        console.log('📡 Llamando a API:', apiUrl);
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        })
        
        if (!response.ok) {
            throw new Error('Error al extraer informacion de la URL')
        }
        
        const data = await response.json()
        return data.data 
        
    } catch (error) {
        console.error('error con la URL:', error)
        return {
            title: 'Título no disponible',
            description: '',
            image: '/default-icon.png'
        } 
    }
}

//CRUD
//add bookmark
export async function addbookmark(formData: FormData) {
    const link = formData.get('link') as string
    
    if (!link) {
        throw new Error('URL es requerida')
    }

    try {
        const websiteData = await scrapWebData(link)
        
        await sql`
            INSERT INTO bookmarks (title, link, description, image, created_at)
            VALUES (${websiteData.title}, ${link}, ${websiteData.description}, ${websiteData.image}, NOW())
        `
        
        revalidatePath('/bookmark')
    } catch (error) {
        console.error('Error adding bookmark:', error)
        throw new Error('Failed to add bookmark')
    }
}

export async function updatebookmark(id:number, title:string, link:string, description:string) {
    await sql `UPDATE bookmarks set title = ${title}, link = ${link}, description = ${description} where id = ${id}`;

    revalidatePath('/');
}

export async function deletebookmark(id:number) {
    await sql `DELETE FROM bookmarks WHERE id =${id}`
    revalidatePath('/')
}