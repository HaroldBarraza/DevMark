//get desde la base de datos
export type bookmark = {
    id: number;
    title: string;
    link: string;
    user_id:string 
}

export type tags = {
    id: string;
    name: string;
    user_id: string;
    createdat: string;
    updatedat: string
}

export type bookmarkWithTags = bookmark & {
    tags: tags[];
}



// 🔹 PROFILE (tabla profiles)
export type Profile = {
  id: string;               // uuid, mismo que auth.users.id
  name: string;
  role: 'USER' | 'ADMIN';
  provider: 'LOCAL' | 'GOOGLE';
  providerId: string | null;
  emailVerified: boolean;
  image: string | null;
  bookmarks: bookmark[];     // array serializado en DB
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
  bookmarks: bookmark[];    // array serializado
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};