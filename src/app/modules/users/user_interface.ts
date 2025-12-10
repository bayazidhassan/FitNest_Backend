export type TUserName = {
  firstName: string;
  lastName: string;
};

export type TRole = 'admin' | 'user';

export type TUser = {
  name: TUserName;
  phone: string;
  email: string;
  image?: string;
  password: string;
  role: TRole;
  isDeleted: boolean;
};
