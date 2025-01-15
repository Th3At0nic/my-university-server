export type TLoginUser = {
  id: string;
  password: string;
};

export type TUserAuthData = {
  userID: string;
  role: string;
};

export type TChangePassData = {
  oldPassword: string;
  newPassword: string;
};
