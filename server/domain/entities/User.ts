export type User = {
  id: string; // uuid
  email: string;
  password?: string; // Hashed password
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  name: string | null;
  avatarUrl: string | null;
};
