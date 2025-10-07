'use server'

import sql from '@/app/lib/databse'
import { revalidatePath } from 'next/cache'

// ==============================
// Funciones auxiliares
// ==============================

function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}

async function scrapWebData(url: string) {
  try {
    const baseUrl = getBaseUrl();
    const apiUrl = `${baseUrl}/api/scrape`;

    console.log('📡 Llamando a API:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) throw new Error('Error al extraer información de la URL');

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error con la URL:', error);
    return {
      title: 'Título no disponible',
      description: '',
      image: '/default-icon.png',
    };
  }
}

// ==============================
// CRUD de Bookmarks
// ==============================

// ➕ Add bookmark (con colecciones, tags y scraping)
export async function addBookmark(formData: FormData, userId: string) {
  const title = (formData.get('title') as string) || '';
  const link = formData.get('link') as string;
  const collectionIds = formData.getAll('collections') as string[];
  const tagInput = (formData.get('tagsInput') as string) || '';

  if (!link) throw new Error('URL es requerida');

  // Extraer información del sitio
  const websiteData = await scrapWebData(link);

  // Crear bookmark
  const res = await sql`
    INSERT INTO "bookmarks" ("title", "link", "description", "image", "user_id")
    VALUES (${websiteData.title || title}, ${link}, ${websiteData.description}, ${websiteData.image}, ${userId})
    RETURNING "id";
  `;
  const bookmarkId = res[0].id;

  // Asociar colecciones
  if (collectionIds.length > 0) {
    await sql`
      INSERT INTO "collection_bookmarks" ("collection_id", "bookmark_id")
      SELECT x.id, ${bookmarkId} FROM UNNEST(${collectionIds}::uuid[]) AS x(id);
    `;
  }

  // Manejo de tags
  const inputTags = tagInput
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);

  for (const tagName of inputTags) {
    const existingTag = await sql`
      SELECT id FROM "tags" WHERE name = ${tagName} AND user_id = ${userId};
    `;

    let tagId: string;
    if (existingTag.length > 0) {
      tagId = existingTag[0].id;
    } else {
      const newTag = await sql`
        INSERT INTO "tags" (name, user_id)
        VALUES (${tagName}, ${userId})
        RETURNING id;
      `;
      tagId = newTag[0].id;
    }

    await sql`
      INSERT INTO "bookmark_tags" ("bookmark_id", "tag_id", "user_id")
      VALUES (${bookmarkId}, ${tagId}, ${userId})
      ON CONFLICT DO NOTHING;
    `;
  }

  revalidatePath('/bookmark');
}

// ✏️ Update bookmark
export async function updateBookmark(
  id: string,
  formData: FormData,
  userId: string
) {
  const title = formData.get('title') as string;
  const link = formData.get('link') as string;
  const collectionIds = formData.getAll('collections') as string[];
  const tagsInput = (formData.get('tagsInput') as string) || '';

  await sql`
    UPDATE "bookmarks"
    SET "title" = ${title},
        "link" = ${link},
        "updated_at" = NOW()
    WHERE "id" = ${id} AND "user_id" = ${userId};
  `;

  // Colecciones
  await sql`DELETE FROM "collection_bookmarks" WHERE "bookmark_id" = ${id};`;
  if (collectionIds.length > 0) {
    await sql`
      INSERT INTO "collection_bookmarks" ("collection_id", "bookmark_id")
      SELECT x.id, ${id} FROM UNNEST(${collectionIds}::uuid[]) AS x(id);
    `;
  }

  // Tags
  const inputTags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
  const currentTagsRes = await sql`
    SELECT t.id, t.name
    FROM "tags" t
    JOIN "bookmark_tags" bt ON bt.tag_id = t.id
    WHERE bt.bookmark_id = ${id};
  `;

  const currentTagNames = currentTagsRes.map(t => t.name);

  const tagsToRemove = currentTagsRes.filter(t => !inputTags.includes(t.name));
  if (tagsToRemove.length > 0) {
    await sql`
      DELETE FROM "bookmark_tags"
      WHERE bookmark_id = ${id} AND tag_id IN (${tagsToRemove.map(t => t.id)});
    `;
  }

  const tagsToAdd = inputTags.filter(t => !currentTagNames.includes(t));
  for (const tagName of tagsToAdd) {
    let tagRes = await sql`
      SELECT id FROM "tags" WHERE name = ${tagName} AND user_id = ${userId};
    `;

    let tagId: string;
    if (tagRes.length > 0) {
      tagId = tagRes[0].id;
    } else {
      const newTag = await sql`
        INSERT INTO "tags" (name, user_id)
        VALUES (${tagName}, ${userId})
        RETURNING id;
      `;
      tagId = newTag[0].id;
    }

    await sql`
      INSERT INTO "bookmark_tags" (bookmark_id, tag_id, user_id)
      VALUES (${id}, ${tagId}, ${userId})
      ON CONFLICT DO NOTHING;
    `;
  }

  revalidatePath('/bookmark');
}

// 🗑️ Delete bookmark
export async function deleteBookmark(id: string, userId: string) {
  await sql`DELETE FROM "collection_bookmarks" WHERE "bookmark_id" = ${id};`;
  await sql`DELETE FROM "bookmark_tags" WHERE "bookmark_id" = ${id};`;
  await sql`
    DELETE FROM "bookmarks"
    WHERE "id" = ${id} AND "user_id" = ${userId};
  `;
  revalidatePath('/bookmark');
}
