import { supabase } from "@/app/lib/supabaseClient";
import { Collection, CollectionBookmark } from "@/app/lib/types";

// ======================================
// CREATE OPERATIONS
// ======================================

/**
 * Creates a new collection for a user
 * @param data - Collection data without auto-generated fields
 * @returns The newly created collection
 * @throws Error if creation fails
 */
export async function createCollection(
  data: Omit<Collection, "id" | "createdAt" | "updatedAt" | "deletedAt" | "bookmarks">
) {
  const { data: result, error } = await supabase
    .from("collections")
    .insert({
      name: data.name,
      isPublic: data.isPublic ?? false,
      user_id: data.userId,
    })
    .select()
    .single();

  if (error) throw error;
  return result as Collection;
}

// ======================================
// READ OPERATIONS
// ======================================

/**
 * Retrieves all collections for a specific user
 * @param userId - The unique identifier of the user
 * @returns Array of user's collections ordered by creation date (newest first)
 * @throws Error if query fails
 */
export async function getCollectionsByUser(userId: string) {
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("user_id", userId)
    .order("createdAt", { ascending: false });

  if (error) throw error;
  return data as Collection[];
}

/**
 * Retrieves a specific collection by its ID
 * @param id - The unique identifier of the collection
 * @returns The collection object
 * @throws Error if collection not found or query fails
 */
export async function getCollectionById(id: string) {
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Collection;
}

// ======================================
// UPDATE OPERATIONS
// ======================================

/**
 * Updates an existing collection with new data
 * @param id - The unique identifier of the collection to update
 * @param updates - Partial collection data to update
 * @returns The updated collection object
 * @throws Error if update fails
 */
export async function updateCollection(
  id: string,
  updates: Partial<Omit<Collection, "id" | "userId" | "createdAt" | "deletedAt">>
) {
  const { data, error } = await supabase
    .from("collections")
    .update({
      ...updates,
      updatedAt: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Collection;
}

// ======================================
// DELETE OPERATIONS
// ======================================

/**
 * Performs a soft delete on a collection by setting deletedAt timestamp
 * @param id - The unique identifier of the collection to delete
 * @returns The soft-deleted collection object
 * @throws Error if deletion fails
 */
export async function deleteCollection(id: string) {
  const { data, error } = await supabase
    .from("collections")
    .update({
      deletedAt: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Collection;
}

/**
 * Performs a permanent hard delete of a collection (use with caution)
 * @param id - The unique identifier of the collection to delete
 * @returns True if deletion was successful
 * @throws Error if deletion fails
 */
export async function hardDeleteCollection(id: string) {
  const { error } = await supabase
    .from("collections")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}

// ======================================
// RELATIONSHIP OPERATIONS
// ======================================

/**
 * Adds a bookmark to a collection
 * @param collectionId - The unique identifier of the collection
 * @param bookmarkId - The unique identifier of the bookmark
 * @returns True if operation was successful
 * @throws Error if operation fails
 */
export async function addBookmarkToCollection(
  collectionId: string,
  bookmarkId: number
) {
  const { error } = await supabase
    .from("collection_bookmark")
    .insert({ collectionId, bookmarkId });

  if (error) throw error;
  return true;
}

/**
 * Retrieves all bookmarks within a specific collection
 * @param collectionId - The unique identifier of the collection
 * @returns Array of collection-bookmark relationships with bookmark data
 * @throws Error if query fails
 */
export async function getBookmarksInCollection(collectionId: string) {
  const { data, error } = await supabase
    .from("collection_bookmark")
    .select(`
      bookmarkId,
      bookmarks (
        id, title, link, description, image, createdAt
      )
    `)
    .eq("collectionId", collectionId);

  if (error) throw error;
  return data as (CollectionBookmark & { bookmarks: unknown })[];
}