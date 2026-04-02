export type CartProduct = {
  _id: string;
  title: string;
  imageCover: string;
  category?: {
    _id?: string;
    name?: string;
  };
};

export type CartApiItem = {
  _id: string;
  count: number;
  price: number;
  product: CartProduct;
};

export type GetUserCartResponse = {
  status: string;
  numOfCartItems: number;
  cartId: string;
  data: {
    _id: string;
    cartOwner: string;
    products: CartApiItem[];
    totalCartPrice: number;
  };
};

export type CartItem = {
  id: string;
  title: string;
  imageCover: string;
  price: number;
  category?: {
    _id?: string;
    name?: string;
  };
  count: number;
};
