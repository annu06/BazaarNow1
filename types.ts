
export type UserRole = 'customer' | 'admin' | 'vendor' | 'delivery';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  image: string;
  storeId: string;
  inStock: boolean;
}

export interface Store {
  id: string;
  name: string;
  location: string;
  city: string;
  rating: number;
  image: string;
  isOpen: boolean;
}

export interface CartItem {
  product: Product;
  store: Store;
  quantity: number;
}

export type OrderStatus = 'placed' | 'approved' | 'out_for_delivery' | 'delivered';

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  deliveryFee: number;
  status: OrderStatus;
  customerId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  paymentMethod: string;
}

export interface AppState {
  customerAuth: User | null;
  adminAuth: User | null;
  vendorAuth: User | null;
  deliveryAuth: User | null;
  cart: CartItem[];
  orders: Order[];
}
