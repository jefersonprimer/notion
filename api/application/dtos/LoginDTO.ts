export type LoginInputDTO = {
  email: string;
  password: string;
};

export type LoginOutputDTO = {
  user: {
    id: string;
    email: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
  accessToken: string;
};
