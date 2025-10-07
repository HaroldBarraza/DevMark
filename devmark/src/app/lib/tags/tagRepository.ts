import { supabase } from "@/app/lib/supabaseClient";
import { Tag } from "@/app/lib/types";

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


export async function getTagsByUser(userId: string) {
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Tag[];
}

export async function getTagById(id: string) {
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Tag;
}

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

// soft delete (opcional)
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

// hard delete
export async function hardDeleteTag(id: string) {
  const { error } = await supabase.from("tags").delete().eq("id", id);
  if (error) throw error;
  return true;
}

// Asociar tag a bookmark

export async function addTagToBookmark(bookmarkId: number, tagId: string) {
  const { error } = await supabase
    .from("bookmark_tag")
    .insert({ bookmarkId, tagId });

  if (error) throw error;
  return true;
}

export async function removeTagFromBookmark(bookmarkId: number, tagId: string) {
  const { error } = await supabase
    .from("bookmark_tag")
    .delete()
    .eq("bookmarkId", bookmarkId)
    .eq("tagId", tagId);

  if (error) throw error;
  return true;
}

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
