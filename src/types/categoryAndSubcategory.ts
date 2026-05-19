// Category type
export type Category = {
     id: string;
     deletedAt: string | null;
     createdAt: string;
     updatedAt: string;
     name: string;
     description: string;
     image: string | null;
     subcategory: Subcategory[];
}

export type Subcategory = {
     id: string;
     deletedAt: string | null;
     createdAt: string;
     updatedAt: string;
     name: string;
     description: string;
     image: string | null;
     categoryId: string;
     category: Category;
}


export type SubcategoryResponse = {
     data: Subcategory[];
     limit: number;
     page: number;
     total: number;
}
