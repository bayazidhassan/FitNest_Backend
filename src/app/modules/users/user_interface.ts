export type TUserName = {
  firstName: string;
  lastName: string;
};

export type TUser = {
  name: TUserName;
  address: string;
  phone: string;
  email: string;
  image?: string;
  password: string;
};
