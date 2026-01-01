export type TCartItems = {
  image: string;
  name: string;
  price: number;
  product_id: string;
  quantity: number;
  stock_quantity: number;
};

export type TStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'returned'
  | 'delivered'
  | 'cancelled';

export type TOrder = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street_address: string;
  upazila: string;
  district: string;
  comment?: string;
  cartItems: TCartItems[];
  totalPrice: number;
  isAlreadyPaid:  boolean;
  status: TStatus;
};
