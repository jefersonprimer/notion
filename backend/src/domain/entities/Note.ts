export type Note = {
  id: string; // uuid
  userId: string; // uuid
  title: string;
  description: string | null;
  createdAt: Date;
};
