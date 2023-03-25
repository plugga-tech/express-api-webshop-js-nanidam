export interface IUser {
  _id: string;
  name: string;
  password: string;
  email: string;
}

export interface IProduct {
  name: string;
  description: string;
  price: number;
  lager: number;
  category: number;
  token: string | undefined;
}
