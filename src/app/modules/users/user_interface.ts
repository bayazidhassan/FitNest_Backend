import { TRole } from '../../@types/role';

export type TUserName = {
  firstName: string;
  lastName: string;
};

//export type TRole = 'admin' | 'user';

export type TUser = {
  name: TUserName;
  phone: string;
  email: string;
  image?: string;
  password: string;
  role: TRole;
  refreshTokens?: string[];
  isDeleted: boolean;
};
