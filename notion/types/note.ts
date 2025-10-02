export type Note = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  createdAt: string; // Dates are often strings in JSON
  is_deleted: boolean;
  deleted_at: string | null;
  is_favorite: boolean;
  parentId?: string | null; // Optional parent ID for nested notes
};

