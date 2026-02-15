export interface Note {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
  user_id: string;
  parent_id: string | null;
  is_deleted?: boolean;
  deleted_at?: string | null;
}
