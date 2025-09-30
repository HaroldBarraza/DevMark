import sql from "@/app/lib/databse"
import type {bookmark} from "@/app/lib/types"

//get notes
export async function getbookmark(): Promise<bookmark[]> {
    const res = await sql `
    SELECT bookmarks.id, bookmarks.title, bookmarks.link, bookmarks.description, bookmarks.image
    FROM bookmarks
    ORDER BY bookmarks.id DESC`;
    return res as unknown as bookmark[]
}

//get single bookmark
export async function getbookmarkById(id: number): Promise<bookmark | null> {
    try {
        const res = await sql `
        SELECT bookmarks.id, bookmarks.title, bookmarks.link, bookmarks.user_id, bookmarks.description, bookmarks.image
        FROM bookmarks
        WHERE bookmarks.id = ${id}`;
        
        if (res.length === 0) {
            return null;
        }
        
        return res[0] as unknown as bookmark;
    } catch (error) {
        console.error('Error fetching bookmark by ID:', error);
        return null;
    }
}