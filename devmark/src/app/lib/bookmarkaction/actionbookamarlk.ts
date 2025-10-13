'use server'

import sql from '@/app/lib/databse'
import { revalidatePath } from 'next/cache'

// ==============================
// Utility Functions
// ==============================

/**
 * Gets the base URL for the application based on environment
 * @returns The base URL string (production or localhost)
 */
function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}

/**
 * Extracts metadata from a website URL using the scraping API
 * @param url - The website URL to scrape
 * @returns Object containing title, description, and image
 */
async function scrapWebData(url: string) {
  try {
    const baseUrl = getBaseUrl();
    const apiUrl = `${baseUrl}/api/scrape`;

    console.log('Calling scraping API:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) throw new Error('Failed to extract information from URL');

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error scraping URL:', error);
    return {
      title: 'Title not available',
      description: '',
      image: '/default-icon.png',
    };
  }
}

// ==============================
// Bookmarks CRUD Operations
// ==============================

/**
 * Creates a new bookmark with automatic metadata extraction
 * Handles collections, tags, and website scraping
 * @param formData - Form data containing bookmark information
 * @param userId - The ID of the user creating the bookmark
 * @throws Error if URL is not provided
 */
export async function addBookmark(formData: FormData, userId: string) {
  const title = (formData.get('title') as string) || '';
  const link = formData.get('link') as string;
  const collectionIds = formData.getAll('collections') as string[];
  const tagInput = (formData.get('tagsInput') as string) || '';

  if (!link) throw new Error('URL is required');

  // Extract website metadata
  const websiteData = await scrapWebData(link);

  // Create bookmark record
  const res = await sql`
    INSERT INTO "bookmarks" ("title", "link", "description", "image", "user_id")
    VALUES (${websiteData.title || title}, ${link}, ${websiteData.description}, ${websiteData.image}, ${userId})
    RETURNING "id";
  `;
  const bookmarkId = res[0].id;

  // Associate with collections
  if (collectionIds.length > 0) {
    await sql`
      INSERT INTO "collection_bookmarks" ("collection_id", "bookmark_id")
      SELECT x.id, ${bookmarkId} FROM UNNEST(${collectionIds}::uuid[]) AS x(id);
    `;
  }

  // Process tags
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

/**
 * Updates an existing bookmark with new information
 * Handles collections and tags updates
 * @param id - The ID of the bookmark to update
 * @param formData - Form data containing updated information
 * @param userId - The ID of the user updating the bookmark
 */
export async function updateBookmark(
  id: string,
  formData: FormData,
  userId: string
) {
  const title = formData.get('title') as string;
  const link = formData.get('link') as string;
  const collectionIds = formData.getAll('collections') as string[];
  const tagsInput = (formData.get('tagsInput') as string) || '';

  // Update bookmark basic information
  await sql`
    UPDATE "bookmarks"
    SET "title" = ${title},
        "link" = ${link},
        "updated_at" = NOW()
    WHERE "id" = ${id} AND "user_id" = ${userId};
  `;

  // Update collections associations
  await sql`DELETE FROM "collection_bookmarks" WHERE "bookmark_id" = ${id};`;
  if (collectionIds.length > 0) {
    await sql`
      INSERT INTO "collection_bookmarks" ("collection_id", "bookmark_id")
      SELECT x.id, ${id} FROM UNNEST(${collectionIds}::uuid[]) AS x(id);
    `;
  }

  // Update tags associations
  const inputTags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
  const currentTagsRes = await sql`
    SELECT t.id, t.name
    FROM "tags" t
    JOIN "bookmark_tags" bt ON bt.tag_id = t.id
    WHERE bt.bookmark_id = ${id};
  `;

  const currentTagNames = currentTagsRes.map(t => t.name);

  // Remove tags that are no longer associated
  const tagsToRemove = currentTagsRes.filter(t => !inputTags.includes(t.name));
  if (tagsToRemove.length > 0) {
    await sql`
      DELETE FROM "bookmark_tags"
      WHERE bookmark_id = ${id} AND tag_id IN (${tagsToRemove.map(t => t.id)});
    `;
  }

  // Add new tags
  const tagsToAdd = inputTags.filter(t => !currentTagNames.includes(t));
  for (const tagName of tagsToAdd) {
    const tagRes = await sql`
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

/**
 * Deletes a bookmark and its associations
 * @param id - The ID of the bookmark to delete
 * @param userId - The ID of the user deleting the bookmark
 * @returns Boolean indicating if the deletion was successful
 */
export async function deleteBookmark(id: string, userId: string): Promise<boolean> {
  try {
    // Remove collection associations
    await sql`DELETE FROM "collection_bookmarks" WHERE "bookmark_id" = ${id};`;
    
    // Remove tag associations
    await sql`DELETE FROM "bookmark_tags" WHERE "bookmark_id" = ${id};`;

    // Delete the bookmark
    const result = await sql`
      DELETE FROM "bookmarks"
      WHERE "id" = ${id} AND "user_id" = ${userId}
      RETURNING "id";
    `;

    revalidatePath('/bookmark');

    // Return true if any records were deleted, false otherwise
    return result.length > 0;
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return false;
  }
}