// ==================================
//  BOOKMARK
// ==================================
export type Bookmark = {
  id: string;       // PK
  title: string;
  link: string;
  userId: string;   // FK → Profile.id
  createdAt: string;
  updatedAt: string;
  description: string | null;
  image: string | null;

  // Relaciones
  tags?: Tag[];             // N:M → BookmarkTag
  collections?: Collection[]; // N:M → CollectionBookmark
};

// ==================================
//  TAG
// ==================================
export type Tag = {
  id: string;       // PK (uuid o string)
  name: string;
  userId: string;   // FK → Profile.id
  createdAt: string;
  updatedAt: string;

  // Relaciones
  bookmarks?: Bookmark[];   // N:M → BookmarkTag
};

// ==================================
//  BOOKMARK_TAG (tabla intermedia)
// ==================================
export type BookmarkTag = {
  bookmarkId: number; // FK → Bookmark.id
  tagId: string;      // FK → Tag.id
};

// ==================================
//  COLLECTION
// ==================================
export type Collection = {
  id: string;       // PK (uuid)
  name: string;
  isPublic: boolean;
  userId: string;   // FK → Profile.id
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  // Relaciones
  bookmarks?: Bookmark[]; // N:M → CollectionBookmark
};

// ==================================
//  COLLECTION_BOOKMARK (tabla intermedia)
// ==================================
export type CollectionBookmark = {
  collectionId: string; // FK → Collection.id
  bookmarkId: number;   // FK → Bookmark.id
};

// ==================================
//  PROFILE (tabla profiles)
// ==================================
export type Profile = {
  id: string;        // uuid, mismo que auth.users.id
  name: string;
  role: 'USER' | 'ADMIN';
  provider: 'LOCAL' | 'GOOGLE';
  providerId: string | null;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  // Relaciones
  bookmarks?: Bookmark[];
  collections?: Collection[];
  tags?: Tag[];
};

