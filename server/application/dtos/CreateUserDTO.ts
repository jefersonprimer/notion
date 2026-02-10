export type CreateUserInputDTO = {
  email: string;
  password: string; // A senha não é parte da nossa entidade User, mas é necessária para o caso de uso.
  displayName: string;
};

export type CreateUserOutputDTO = {
  id: string;
  email: string;
};
