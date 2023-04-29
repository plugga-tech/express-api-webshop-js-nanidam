export interface IUser {
  _id: string;
  name: string;
  password: string;
  email: string;
}

//VG: Create product
export interface IProduct {
  name: string;
  description: string;
  price: number;
  lager: number;
  category: number;
  token: string | undefined;
}

//G: Create product
// export interface IProduct {
//   name: string;
//   description: string;
//   price: number;
//   lager: number;
// }

type productOrder = {
  productId: string;
  quantity: number;
};

export interface IOrder {
  user: string;
  products: productOrder[];
}

export interface ICategory {
  name: string;
  token: string | undefined;
}
