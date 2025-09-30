'use server'

import sql from '@/app/lib/databse'
import { revalidatePath } from 'next/cache'


// extraer oinformacion de la pagina

async function scrapWebData(url:string) {
    try{
        const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/scrape`,
            {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify({url}),
            
        })
        if(!response.ok){
            throw new Error('Error al extraer informacion de la URL')
        }
        const data = await response.json()
        return data.data 
    }catch(error){
        console.error('error con la URL:', error)
        return{
            title: ' titulo o no encontrado',
            description : '',
            image :'/default-icon.png'
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

export async function updatebookmark(id:number, title:string, link:string) {
    await sql `UPDATE bookmarks set title = ${title}, link = ${link} where id = ${id}`;

    revalidatePath('/');
}

export async function deletebookmark(id:number) {
    await sql `DELETE FROM bookmarks WHERE id =${id}`
    revalidatePath('/')
}