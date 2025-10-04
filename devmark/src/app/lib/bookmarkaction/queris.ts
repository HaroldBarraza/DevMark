import sql from "@/app/lib/databse"
import type {Bookmark} from "@/app/lib/types"

//get notes
export async function getBookmarks(): Promise<Bookmark[]> {
    const res = await sql`
        SELECT "id", "title", "link", "userId",
               "createdAt", "updatedAt",
               "description", "image"
        FROM "bookmarks"
        ORDER BY "id" DESC;
    `;
    return res as unknown as Bookmark[];
}

//get single bookmark
export async function getBookmarkById(id: number): Promise<Bookmark | null> {
    try {
        const res = await sql`
            SELECT "id", "title", "link", "user_id" AS "userId",
                   "created_at",
                   "updated_at",
                   "description", "image"
            FROM "bookmarks"
            WHERE "id" = ${id};
        `;
        
        if (res.length === 0) {
            return null;
        }

        return res[0] as unknown as Bookmark;
    } catch (error) {
        console.error('Error fetching bookmark by ID:', error);
        return null;
    }
}


// IMPORTANTE: QUERIE PARA EL USUARIO LOGEADO

// Get bookmarks for a specific user
export async function getBookmarksByUser(userId: string): Promise<Bookmark[]> {
    const res = await sql`
        SELECT "id", "title", "link", "user_id" as "userId",
               "created_at" as "createdAt",
               "updated_at" as "updatedAt",
               "description", "image"
        FROM "bookmarks"
        WHERE "user_id" = ${userId}
        ORDER BY "id" DESC;
    `;
    return res as unknown as Bookmark[];
}

// Get a specific bookmark for a specific user
export async function getBookmarkByIdForUser(id: number, userId: string): Promise<Bookmark | null> {
    const res = await sql`
        SELECT "id", "title", "link", "user_id" as "userId",
               "created_at" as "createdAt",
               "updated_at" as "updatedAt",
               "description", "image"
        FROM "bookmarks"
        WHERE "id" = ${id} AND "user_id" = ${userId};
    `;

    if (res.length === 0) return null;
    return res[0] as unknown as Bookmark;
}

// Get bookmarks for a specific user WITH tags
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

export async function getBookmarksByTag(tagId: string, userId: string): Promise<Bookmark[]> {
  const res = await sql`
    SELECT b.id, b.title, b.link, b.user_id AS "userId",
           b.created_at AS "createdAt",
           b.updated_at AS "updatedAt",
           b.description, b.image,
           COALESCE(json_agg(json_build_object('id', t.id, 'name', t.name)) 
                    FILTER (WHERE t.id IS NOT NULL), '[]') AS tags
    FROM bookmarks b
    INNER JOIN bookmark_tags bt ON bt.bookmark_id = b.id
    LEFT JOIN tags t ON t.id = bt.tag_id
    WHERE b.user_id = ${userId}
      AND bt.tag_id = ${tagId}
    GROUP BY b.id
    ORDER BY b.id DESC;
  `;
  return res as unknown as Bookmark[];
}

// QUERIE PARA BOOKMARKS CON COLECCIONES

export async function getBookmarkWithCollections(id: number) {
    const res = await sql`
        SELECT b.*, json_agg(c.*) as collections
        FROM "bookmarks" b
        LEFT JOIN "collection_bookmarks" cb ON cb.bookmark_id = b.id
        LEFT JOIN "collections" c ON c.id = cb.collection_id
        WHERE b.id = ${id}
        GROUP BY b.id;
    `;
    return res[0] as unknown as Bookmark & { collections: { id: string; name: string }[] };
}
