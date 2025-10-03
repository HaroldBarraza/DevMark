'use server'

import sql from '@/app/lib/databse'
import { revalidatePath } from 'next/cache'

// Add bookmark
export async function addBookmark(formData: FormData, userId: string) {
    const title = formData.get('title') as string;
    const link = formData.get('link') as string;
    const collectionIds = formData.getAll('collections') as string[]; 

    const res = await sql`
        INSERT INTO "bookmarks" ("title", "link", "user_id")
        VALUES (${title}, ${link}, ${userId})
        RETURNING "id";
    `;
    
    const bookmarkId = res[0].id;

    // Asociar bookmark a colecciones si existen
    if (collectionIds.length > 0) {
        await sql`
            INSERT INTO "collection_bookmarks" ("collection_id", "bookmark_id")
            SELECT x.id, ${bookmarkId} FROM UNNEST(${collectionIds}::uuid[]) AS x(id);
        `;
    }

    revalidatePath('/');
}

// Update bookmark
export async function updateBookmark(id: number, formData: FormData) {
    const title = formData.get('title') as string;
    const link = formData.get('link') as string;
    const collectionIds = formData.getAll('collections') as string[];

    await sql`
        UPDATE "bookmarks"
        SET "title" = ${title},
            "link" = ${link},
            "updated_at" = NOW()
        WHERE "id" = ${id};
    `;

    // Actualizar colecciones: borrar relaciones existentes y agregar nuevas
    await sql`DELETE FROM "collection_bookmarks" WHERE "bookmark_id" = ${id};`;

    if (collectionIds.length > 0) {
        await sql`
            INSERT INTO "collection_bookmarks" ("collection_id", "bookmark_id")
            SELECT x.id, ${id} FROM UNNEST(${collectionIds}::uuid[]) AS x(id);
        `;
    }

    revalidatePath('/');
}

// Delete bookmark
export async function deleteBookmark(id: number) {
    // Borrar relaciones con colecciones primero
    await sql`DELETE FROM "collection_bookmarks" WHERE "bookmark_id" = ${id};`;

    await sql`
        DELETE FROM "bookmarks"
        WHERE "id" = ${id};
    `;

    revalidatePath('/');
}
