'use server'

import sql from '@/app/lib/databse'
import { revalidatePath } from 'next/cache'

// CRUD
// Add bookmark
export async function addBookmark(formData: FormData, userId: string) {
    const title = formData.get('title') as string;
    const link = formData.get('link') as string;

    await sql`
        INSERT INTO "bookmarks" ("title", "link", "user_id")  -- <- CORRECTO
        VALUES (${title}, ${link}, ${userId});
    `;

    revalidatePath('/');
}


// Update bookmark

export async function updateBookmark(id: number, title: string, link: string) {
    await sql`
        UPDATE "bookmarks"
        SET "title" = ${title},
            "link" = ${link},
            "updatedAt" = NOW()
        WHERE "id" = ${id};
    `;

    revalidatePath('/');
}

// Delete bookmark
export async function deleteBookmark(id: number) {
    await sql`
        DELETE FROM "bookmarks"
        WHERE "id" = ${id};
    `;

    revalidatePath('/');
}
