// app/lib/bookmarkaction/queris.ts
import sql from "@/app/lib/databse";
import type { Bookmark } from "@/app/lib/types";

// -----------------------------
// GET ALL BOOKMARKS
// -----------------------------

/**
 * Retrieves all bookmarks from the database
 * @returns Array of all bookmarks ordered by creation date (newest first)
 */
export async function getBookmarks(): Promise<Bookmark[]> {
  const res = await sql`
    SELECT id, title, link, user_id AS "userId",
           created_at AS "createdAt",
           updated_at AS "updatedAt",
           description, image
    FROM bookmarks
    ORDER BY id DESC;
  `;
  return res as unknown as Bookmark[];
}

// -----------------------------
// GET SINGLE BOOKMARK BY ID
// -----------------------------

/**
 * Retrieves a specific bookmark by its ID including associated tags
 * @param id - The unique identifier of the bookmark
 * @returns Bookmark object with tags or null if not found
 */
export async function getBookmarkById(id: string): Promise<Bookmark | null> {
  try {
    const res = await sql`
      SELECT 
        b.id, 
        b.title, 
        b.link, 
        b.user_id AS "userId",
        b.created_at AS "createdAt",
        b.updated_at AS "updatedAt",
        b.description, 
        b.image,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', t.id,
              'name', t.name
            )
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) as tags
      FROM bookmarks b
      LEFT JOIN bookmark_tags bt ON bt.bookmark_id = b.id
      LEFT JOIN tags t ON t.id = bt.tag_id
      WHERE b.id = ${id}
      GROUP BY b.id;
    `;
    
    if (res.length === 0) return null;
    return res[0] as unknown as Bookmark;
  } catch (error) {
    console.error('Error fetching bookmark by ID:', error);
    return null;
  }
}

// -----------------------------
// GET BOOKMARKS BY USER
// -----------------------------

/**
 * Retrieves all bookmarks for a specific user
 * @param userId - The unique identifier of the user
 * @returns Array of user's bookmarks ordered by creation date (newest first)
 */
export async function getBookmarksByUser(userId: string): Promise<Bookmark[]> {
  const res = await sql`
    SELECT id, title, link, user_id AS "userId",
           created_at AS "createdAt",
           updated_at AS "updatedAt",
           description, image
    FROM bookmarks
    WHERE user_id = ${userId}
    ORDER BY id DESC;
  `;
  return res as unknown as Bookmark[];
}

// -----------------------------
// GET SINGLE BOOKMARK BY USER
// -----------------------------

/**
 * Retrieves a specific bookmark ensuring it belongs to the specified user
 * @param id - The unique identifier of the bookmark
 * @param userId - The unique identifier of the user
 * @returns Bookmark object or null if not found or doesn't belong to user
 */
export async function getBookmarkByIdForUser(id: string, userId: string): Promise<Bookmark | null> {
  const res = await sql`
    SELECT id, title, link, user_id AS "userId",
           created_at AS "createdAt",
           updated_at AS "updatedAt",
           description, image
    FROM bookmarks
    WHERE id = ${id} AND user_id = ${userId};
  `;
  if (res.length === 0) return null;
  return res[0] as unknown as Bookmark;
}

// -----------------------------
// GET BOOKMARKS WITH TAGS
// -----------------------------

/**
 * Retrieves all bookmarks for a user including their associated tags
 * @param userId - The unique identifier of the user
 * @returns Array of bookmarks with tags included as nested arrays
 */
export async function getBookmarksByUserWithTags(userId: string): Promise<Bookmark[]> {
  const res = await sql`
    SELECT b.id, b.title, b.link, b.user_id AS "userId",
           b.created_at AS "createdAt",
           b.updated_at AS "updatedAt",
           b.description, b.image,
           COALESCE(json_agg(json_build_object('id', t.id, 'name', t.name)) 
                    FILTER (WHERE t.id IS NOT NULL), '[]') AS tags
    FROM bookmarks b
    LEFT JOIN bookmark_tags bt ON bt.bookmark_id = b.id
    LEFT JOIN tags t ON t.id = bt.tag_id
    WHERE b.user_id = ${userId}
    GROUP BY b.id
    ORDER BY b.id DESC;
  `;
  return res as unknown as Bookmark[];
}

// -----------------------------
// GET BOOKMARKS BY TAG
// -----------------------------

/**
 * Retrieves all bookmarks associated with a specific tag for a user
 * @param tagId - The unique identifier of the tag
 * @param userId - The unique identifier of the user
 * @returns Array of bookmarks filtered by tag with their tags included
 */
export async function getBookmarksByTag(tagId: string, userId: string): Promise<Bookmark[]> {
  const res = await sql`
    SELECT b.id, b.title, b.link, b.image, b.user_id AS "userId",
           b.created_at AS "createdAt",
           b.updated_at AS "updatedAt",
           b.description, b.image,
           COALESCE(json_agg(json_build_object('id', t.id, 'name', t.name)) 
                    FILTER (WHERE t.id IS NOT NULL), '[]') AS tags
    FROM bookmarks b
    INNER JOIN bookmark_tags bt ON bt.bookmark_id = b.id
    LEFT JOIN tags t ON t.id = bt.tag_id
    WHERE b.user_id = ${userId} AND bt.tag_id = ${tagId}
    GROUP BY b.id
    ORDER BY b.id DESC;
  `;
  return res as unknown as Bookmark[];
}

// -----------------------------
// GET BOOKMARK WITH COLLECTIONS
// -----------------------------

/**
 * Retrieves a specific bookmark including its associated collections
 * @param id - The unique identifier of the bookmark
 * @returns Bookmark object with collections included as nested array
 */
export async function getBookmarkWithCollections(id: string) {
  const res = await sql`
    SELECT b.*, json_agg(c.*) as collections
    FROM bookmarks b
    LEFT JOIN collection_bookmarks cb ON cb.bookmark_id = b.id
    LEFT JOIN collections c ON c.id = cb.collection_id
    WHERE b.id = ${id}
    GROUP BY b.id;
  `;
  return res[0] as unknown as Bookmark & { collections: { id: string; name: string }[] };
}