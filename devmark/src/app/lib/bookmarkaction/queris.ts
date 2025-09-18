import sql from "@/app/lib/databse"
import type {bookmark} from "@/app/lib/types"

//get notes
export async function getbookmark(): Promise<bookmark[]> {
    const res = await sql `
    SELECT test.id, test.title, test.link
    FROM test
    ORDER BY test.id DESC`;
    return res as unknown as bookmark[]
}