//get desde la base de datos
export type bookmark = {
    id: number;
    title: string;
    link: string;
    image: string;
    description: string;
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