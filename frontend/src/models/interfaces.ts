export interface IProduct {
  name: string;
  description: string;
  price: number;
  lager: number;
  category: number;
  token: string | undefined;
}

export interface IProductListItem {
  productId: string;
  quantity: number;
}

export interface ICategory {
  id: string;
  name: string;
  token: string;
}
