// ==================================
//  BOOKMARK TYPE
// ==================================

/**
 * Represents a saved website bookmark with metadata and relationships
 */
export type Bookmark = {
  id: string;       // Primary key
  title: string;
  link: string;
  userId: string;   // Foreign key → Profile.id
  createdAt: string;
  updatedAt: string;
  description: string | null;
  image: string | null;

  // Optional relationships
  tags?: Tag[];             // Many-to-many → BookmarkTag
  collections?: Collection[]; // Many-to-many → CollectionBookmark
};

// ==================================
//  TAG TYPE
// ==================================

/**
 * Represents a user-defined tag for categorizing bookmarks
 */
export type Tag = {
  id: string;       // Primary key (UUID or string)
  name: string;
  userId: string;   // Foreign key → Profile.id
  createdAt: string;
  updatedAt: string;

  // Optional relationships
  bookmarks?: Bookmark[];   // Many-to-many → BookmarkTag
};

// ==================================
//  BOOKMARK_TAG TYPE (Junction Table)
// ==================================

/**
 * Junction table representing the many-to-many relationship between bookmarks and tags
 */
export type BookmarkTag = {
  bookmarkId: number; // Foreign key → Bookmark.id
  tagId: string;      // Foreign key → Tag.id
};

// ==================================
//  COLLECTION TYPE
// ==================================

/**
 * Represents a user-created collection for organizing bookmarks
 */
export type Collection = {
  id: string;       // Primary key (UUID)
  name: string;
  isPublic: boolean;
  userId: string;   // Foreign key → Profile.id
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null; // Soft delete timestamp

  // Optional relationships
  bookmarks?: Bookmark[]; // Many-to-many → CollectionBookmark
};

// ==================================
//  COLLECTION_BOOKMARK TYPE (Junction Table)
// ==================================

/**
 * Junction table representing the many-to-many relationship between collections and bookmarks
 */
export type CollectionBookmark = {
  collectionId: string; // Foreign key → Collection.id
  bookmarkId: number;   // Foreign key → Bookmark.id
};

// ==================================
//  PROFILE TYPE (User Profile)
// ==================================

/**
 * Represents a user profile with authentication and application data
 */
export type Profile = {
  id: string;        // UUID, matches auth.users.id
  name: string;
  role: 'USER' | 'ADMIN';
  provider: 'LOCAL' | 'GOOGLE';
  providerId: string | null;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null; // Soft delete timestamp

  // Optional relationships
  bookmarks?: Bookmark[];
  collections?: Collection[];
  tags?: Tag[];
};