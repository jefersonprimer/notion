export type Note = {
  id: string; // uuid
  userId: string; // uuid
  title: string;
  description: string | null;
  createdAt: Date;
  is_deleted: boolean; // For soft delete
  deleted_at: Date | null; // To know when it was moved to trash
  updated_at: Date;
  is_favorite: boolean;
  parentId: string | null;
};
