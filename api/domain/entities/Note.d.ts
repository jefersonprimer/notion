export type Note = {
    id: string;
    userId: string;
    title: string;
    description: string | null;
    createdAt: Date;
    is_deleted: boolean;
    deleted_at: Date | null;
    updated_at: Date;
    is_favorite: boolean;
};
//# sourceMappingURL=Note.d.ts.map