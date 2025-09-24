import sql from "@/app/lib/databse"
import type {bookmark} from "@/app/lib/types"

//get notes
export async function getbookmark(): Promise<bookmark[]> {
    const res = await sql `
    SELECT bookmark.id, bookmark.title, bookmark.link
    FROM bookmark
    ORDER BY bookmark.id DESC`;
    return res as unknown as bookmark[]
}

//get single bookmark
export async function getbookmarkById(id: number): Promise<bookmark | null> {
    try {
        const res = await sql `
        SELECT bookmark.id, bookmark.title, bookmark.link, bookmark.user_id
        FROM bookmark
        WHERE bookmark.id = ${id}`;
        
        if (res.length === 0) {
            return null;
        }
        
        return res[0] as unknown as bookmark;
    } catch (error) {
        console.error('Error fetching bookmark by ID:', error);
        return null;
    }
}