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

type productOrder = {
  productId: string;
  quantity: number;
};

export interface IOrder {
  user: string;
  products: productOrder[];
  token: string | undefined;
}

export interface ICategory {
  name: string;
  token: string | undefined;
}
