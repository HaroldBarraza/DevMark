'use server'

import sql from '@/app/lib/databse'
import { revalidatePath } from 'next/cache'

// Add bookmark
// Add bookmark with collections and tags
export async function addBookmark(formData: FormData, userId: string) {

    const title = formData.get('title') as string;
    const link = formData.get('link') as string;
    const collectionIds = formData.getAll('collections') as string[];
    const tagInput = formData.get('tagsInput') as string; // campo de texto editable


    const res = await sql`
    INSERT INTO "bookmarks" ("title", "link", "user_id")
    VALUES (${title}, ${link}, ${userId})
    RETURNING "id";
  `;

    const bookmarkId = res[0].id;

    if (collectionIds.length > 0) {
        await sql`
      INSERT INTO "collection_bookmarks" ("collection_id", "bookmark_id")
      SELECT x.id, ${bookmarkId} FROM UNNEST(${collectionIds}::uuid[]) AS x(id);
    `;
    }

    const inputTags = tagInput
        ? tagInput.split(',').map(t => t.trim()).filter(Boolean)
        : [];

    for (const tagName of inputTags) {

        const existingTag = await sql`
      SELECT id FROM "tags" WHERE name = ${tagName} AND user_id = ${userId};
    `;

        let tagId: string;
        if (existingTag.length > 0) {
            tagId = existingTag[0].id;
        } else {
            // Crear tag nuevo
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

    revalidatePath('/');
}

// Update bookmark
export async function updateBookmark(
  id: string,           // <-- string
  formData: FormData,
  userId: string
) {
  const title = formData.get('title') as string;
  const link = formData.get('link') as string;
  const collectionIds = formData.getAll('collections') as string[];
  const tagsInput = (formData.get('tagsInput') as string) || '';

  // 1️⃣ Actualizar bookmark asegurando userId
  await sql`
    UPDATE "bookmarks"
    SET "title" = ${title},
        "link" = ${link},
        "updated_at" = NOW()
    WHERE "id" = ${id} AND "user_id" = ${userId};
  `;

  // 2️⃣ Actualizar colecciones
  await sql`DELETE FROM "collection_bookmarks" WHERE "bookmark_id" = ${id};`;

  if (collectionIds.length > 0) {
    await sql`
      INSERT INTO "collection_bookmarks" ("collection_id", "bookmark_id")
      SELECT x.id, ${id} FROM UNNEST(${collectionIds}::uuid[]) AS x(id);
    `;
  }

  // 3️⃣ Manejar tags
  const inputTags = tagsInput
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);

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

export async function deleteBookmark(id: string, userId: string) {  // <-- string
  await sql`DELETE FROM "collection_bookmarks" WHERE "bookmark_id" = ${id};`;
  await sql`DELETE FROM "bookmark_tags" WHERE "bookmark_id" = ${id};`;
  await sql`
    DELETE FROM "bookmarks"
    WHERE "id" = ${id} AND "user_id" = ${userId};
  `;
  revalidatePath('/bookmark');
}
