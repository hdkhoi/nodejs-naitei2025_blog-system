export interface IProfile {
  username: string;
  bio?: string;
  image?: string;
  following?: boolean;
}

export interface IUser extends IProfile {
  email: string;
  token?: string;
}