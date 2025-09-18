'use server'

import sql from '@/app/lib/databse'
import { revalidatePath } from 'next/cache'

//CRUD
//add bookmark
export async function addbookmark(formData: FormData) {
    const title = formData.get('title') as string
    const link = formData.get('link') as string

    await sql`
    INSERT INTO test (title, link)
    VALUES (${title},${link})`
}

export async function updatebookmark(id:number, title:string, link:string) {
    await sql `UPDATE test set title = ${title}, link = ${link} where id = ${id}`;

    revalidatePath('/');
}

export async function deletebookmark(id:number) {
    await sql `DELETE FROM test WHERE id =${id}`
    revalidatePath('/')
}