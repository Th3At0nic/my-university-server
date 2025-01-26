export type TLoginUser = {
  id: string;
  password: string;
};

export type TUserAuthData = {
  userId: string;
  role: string;
};

export type TChangePassData = {
  oldPassword: string;
  newPassword: string;
};

export type TResetPassData = {
  id: string;
  newPassword: string;
};
