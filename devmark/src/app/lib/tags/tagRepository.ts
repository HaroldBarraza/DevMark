import { supabase } from "@/app/lib/supabaseClient";
import { Tag } from "@/app/lib/types";

// ======================================
// CREATE OPERATIONS
// ======================================

/**
 * Creates a new tag for a user
 * @param data - Tag data including name and user ID
 * @returns The newly created tag
 * @throws Error if creation fails
 */
export async function createTag(data: { name: string; user_id: string }) {
  const { data: result, error } = await supabase
    .from("tags")
    .insert({
      name: data.name,
      user_id: data.user_id,
    })
    .select()
    .single();

  if (error) throw error;
  return result as Tag;
}

// ======================================
// READ OPERATIONS
// ======================================

/**
 * Retrieves all tags for a specific user
 * @param userId - The unique identifier of the user
 * @returns Array of user's tags ordered by creation date (newest first)
 * @throws Error if query fails
 */
export async function getTagsByUser(userId: string) {
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Tag[];
}

/**
 * Retrieves a specific tag by its ID
 * @param id - The unique identifier of the tag
 * @returns The tag object
 * @throws Error if tag not found or query fails
 */
export async function getTagById(id: string) {
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Tag;
}

// ======================================
// UPDATE OPERATIONS
// ======================================

/**
 * Updates an existing tag with new data
 * @param id - The unique identifier of the tag to update
 * @param updates - Partial tag data to update
 * @returns The updated tag object
 * @throws Error if update fails
 */
export async function updateTag(id: string, updates: Partial<Omit<Tag, "id" | "userId" | "created_at">>) {
  const { data, error } = await supabase
    .from("tags")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Tag;
}

// ======================================
// DELETE OPERATIONS
// ======================================

/**
 * Performs a soft delete on a tag by setting deletedAt timestamp
 * @param id - The unique identifier of the tag to delete
 * @returns The soft-deleted tag object
 * @throws Error if deletion fails
 */
export async function deleteTag(id: string) {
  const { data, error } = await supabase
    .from("tags")
    .update({ deletedAt: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Tag;
}

/**
 * Performs a permanent hard delete of a tag (use with caution)
 * @param id - The unique identifier of the tag to delete
 * @returns True if deletion was successful
 * @throws Error if deletion fails
 */
export async function hardDeleteTag(id: string) {
  const { error } = await supabase.from("tags").delete().eq("id", id);
  if (error) throw error;
  return true;
}

// ======================================
// BOOKMARK-TAG RELATIONSHIP OPERATIONS
// ======================================

/**
 * Associates a tag with a bookmark
 * @param bookmarkId - The unique identifier of the bookmark
 * @param tagId - The unique identifier of the tag
 * @returns True if operation was successful
 * @throws Error if operation fails
 */
export async function addTagToBookmark(bookmarkId: number, tagId: string) {
  const { error } = await supabase
    .from("bookmark_tag")
    .insert({ bookmarkId, tagId });

  if (error) throw error;
  return true;
}

/**
 * Removes a tag association from a bookmark
 * @param bookmarkId - The unique identifier of the bookmark
 * @param tagId - The unique identifier of the tag
 * @returns True if operation was successful
 * @throws Error if operation fails
 */
export async function removeTagFromBookmark(bookmarkId: number, tagId: string) {
  const { error } = await supabase
    .from("bookmark_tag")
    .delete()
    .eq("bookmarkId", bookmarkId)
    .eq("tagId", tagId);

  if (error) throw error;
  return true;
}

/**
 * Retrieves all tags associated with a specific bookmark
 * @param bookmarkId - The unique identifier of the bookmark
 * @returns Array of tag associations with tag data
 * @throws Error if query fails
 */
export async function getTagsOfBookmark(bookmarkId: number) {
  const { data, error } = await supabase
    .from("bookmark_tag")
    .select(`
      tagId,
      tags(id, name)
    `)
    .eq("bookmarkId", bookmarkId);

  if (error) throw error;
  return data;
}