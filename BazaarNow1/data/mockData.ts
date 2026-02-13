
import { Store, Product, User } from '../types';

export const LOCATIONS = [
  'Gachibowli', 'Madhapur', 'Kukatpally', 'Ameerpet', 'LB Nagar', 'Secunderabad'
];

export const FEATURES = [
  { title: 'Local Kirana Stores', desc: 'Shop from your favorite neighborhood stores.', icon: 'Store' },
  { title: 'Quick Delivery', desc: 'Get your groceries at your doorstep in 30 mins.', icon: 'Zap' },
  { title: 'Quality Assured', desc: 'Handpicked fresh products just for you.', icon: 'CheckCircle' }
];

export const HOW_IT_WORKS = [
  { step: 1, title: 'Browse Stores', desc: 'Select a store from your local area.', icon: 'Search' },
  { step: 2, title: 'Add to Cart', desc: 'Choose from a wide variety of fresh products.', icon: 'ShoppingCart' },
  { step: 3, title: 'Get Delivered', desc: 'Track your order and get it delivered fast.', icon: 'Truck' }
];

export const STORES: Store[] = [
  { id: 's1', name: 'Heritage Fresh', location: 'Gachibowli', city: 'Hyderabad', rating: 4.5, isOpen: true, image: 'https://picsum.photos/seed/heritage/400/300' },
  { id: 's2', name: 'Ratnadeep Supermarket', location: 'Madhapur', city: 'Hyderabad', rating: 4.7, isOpen: true, image: 'https://picsum.photos/seed/ratnadeep/400/300' },
  { id: 's3', name: 'Vijetha Super Market', location: 'Kukatpally', city: 'Hyderabad', rating: 4.3, isOpen: true, image: 'https://picsum.photos/seed/vijetha/400/300' },
  { id: 's4', name: 'Q-Mart Specialty', location: 'Gachibowli', city: 'Hyderabad', rating: 4.8, isOpen: false, image: 'https://picsum.photos/seed/qmart/400/300' },
  { id: 's5', name: 'More Supermarket', location: 'Ameerpet', city: 'Hyderabad', rating: 4.1, isOpen: true, image: 'https://picsum.photos/seed/more/400/300' },
  { id: 's6', name: 'Nilgiris Store', location: 'Secunderabad', city: 'Hyderabad', rating: 4.4, isOpen: true, image: 'https://picsum.photos/seed/nilgiris/400/300' }
];

const CATEGORIES = ['Dairy', 'Grains', 'Produce', 'Snacks', 'Beverages'];
const PRODUCT_NAMES = [
  'Full Cream Milk', 'Brown Bread', 'Cage Free Eggs', 'Basmati Rice', 'Moong Dal',
  'Organic Apple', 'Fresh Spinach', 'Tomato Ketchup', 'Potato Chips', 'Orange Juice',
  'Greek Yogurt', 'Whole Wheat Atta', 'Peanut Butter', 'Green Tea', 'Extra Virgin Olive Oil',
  'Masoor Dal', 'Chickpeas', 'Frozen Peas', 'Butter Cookies', 'Dark Chocolate',
  'Toned Milk', 'Multigrain Bread', 'Turmeric Powder', 'Red Chili Powder', 'Cumin Seeds',
  'Fresh Bananas', 'Carrots', 'Cabbage', 'Cauliflower', 'Green Chilies',
  'Basmati Rice 5kg', 'Sunflower Oil', 'Salt 1kg', 'Sugar 1kg', 'Tea Powder',
  'Coffee Beans', 'Oats', 'Honey', 'Almonds', 'Cashews',
  'Paneer', 'Butter', 'Cheese Slices', 'Ghee', 'Ice Cream Vanilla',
  'Dishwash Bar', 'Detergent Powder', 'Hand Wash', 'Shampoo', 'Toothpaste'
];

export const ALL_PRODUCTS: Product[] = PRODUCT_NAMES.map((name, idx) => ({
  id: `p${idx + 1}`,
  name,
  price: Math.floor(Math.random() * 500) + 20,
  unit: idx % 5 === 0 ? 'Litre' : idx % 3 === 0 ? 'kg' : 'Packet',
  category: CATEGORIES[idx % CATEGORIES.length],
  image: `https://picsum.photos/seed/${name.replace(/\s/g, '')}/300/300`,
  storeId: STORES[idx % STORES.length].id,
  inStock: Math.random() > 0.1
}));

export const MOCK_USERS: User[] = [
  { id: 'u1', email: 'user@bazaarnow.com', role: 'customer', name: 'Rahul Customer' },
  { id: 'a1', email: 'admin@bazaarnow.com', role: 'admin', name: 'Admin User' },
  { id: 'v1', email: 'vendor@bazaarnow.com', role: 'vendor', name: 'Heritage Manager' },
  { id: 'd1', email: 'delivery@bazaarnow.com', role: 'delivery', name: 'Swift Delivery' }
];

export const INITIAL_ORDERS: any[] = [
  {
    id: 'ORD-123',
    date: new Date().toISOString(),
    items: [
      { product: ALL_PRODUCTS[0], store: STORES[0], quantity: 2 },
      { product: ALL_PRODUCTS[1], store: STORES[0], quantity: 1 }
    ],
    total: 350,
    deliveryFee: 30,
    status: 'delivered',
    customerId: 'u1',
    customerName: 'Rahul Customer',
    customerPhone: '9876543210',
    address: 'Flat 401, Cyber Heights, Madhapur, Hyderabad',
    paymentMethod: 'UPI'
  }
];
