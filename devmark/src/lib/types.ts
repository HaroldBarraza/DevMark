
// 🔹 PROFILE (tabla profiles)
export type Profile = {
  id: string;               // uuid, mismo que auth.users.id
  name: string;
  role: 'USER' | 'ADMIN';
  provider: 'LOCAL' | 'GOOGLE';
  providerId: string | null;
  emailVerified: boolean;
  image: string | null;
  bookmarks: Bookmark[];     // array serializado en DB
  collections: Collection[]; // array serializado en DB
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

// 🔹 COLLECTION
export type Collection = {
  id: string;               // uuid
  name: string;
  isPublic: boolean;
  userId: string;           // uuid del Profile
  bookmarks: Bookmark[];    // array serializado
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

// 🔹 BOOKMARK
export type Bookmark = {
  id: string;               // uuid
  title: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

// 🔹 COLLECTION_BOOKMARK (relación)
export type CollectionBookmark = {
  collectionId: string;
  bookmarkId: string;
  collection?: Collection;  // opcional si se hace join
  bookmark?: Bookmark;      // opcional si se hace join
  createdAt: string;
  updatedAt: string;
};