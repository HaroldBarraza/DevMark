import { supabase } from "@/app/lib/supabaseClient";
import { Collection, CollectionBookmark } from "@/app/lib/types"; // ajusta la ruta

// ======================================
// CREATE
// ======================================
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
// READ
// ======================================

// Todas las colecciones de un usuario
export async function getCollectionsByUser(userId: string) {
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("user_id", userId)
    
    .order("createdAt", { ascending: false });

  if (error) throw error;
  return data as Collection[];
}

// Colección por ID
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
// UPDATE
// ======================================
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
// DELETE
// ======================================
// Borrado lógico (soft delete)
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

// Borrado físico (opcional)
// ⚠️ cuidado: elimina definitivamente
export async function hardDeleteCollection(id: string) {
  const { error } = await supabase
    .from("collections")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}

// ======================================
// RELACIONES
// ======================================

// Agregar bookmark a una colección
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

// Obtener bookmarks de una colección
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
