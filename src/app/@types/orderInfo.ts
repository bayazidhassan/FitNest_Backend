export type TCartItem = {
  product_id: string;
  name: string;
  price: number;
  image: string;
  stock_quantity: number;
  quantity: number;
};

export type TOrderInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street_address: string;
  upazila: string;
  district: string;
  comment?: string;
  cartItems: TCartItem[];
  totalPrice: number;
};