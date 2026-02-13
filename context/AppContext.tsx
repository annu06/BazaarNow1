
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole, CartItem, Product, Store, Order, AppState, OrderStatus } from '../types';
import { INITIAL_ORDERS } from '../data/mockData';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface AppContextType {
  customerAuth: User | null;
  adminAuth: User | null;
  vendorAuth: User | null;
  deliveryAuth: User | null;
  cart: CartItem[];
  orders: Order[];
  login: (user: User) => void;
  logout: (role: UserRole) => void;
  loginWithGoogle: () => Promise<void>;
  firebaseUser: FirebaseUser | null;
  authLoading: boolean;
  addToCart: (product: Product, store: Store) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  createOrder: (orderData: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('bazaarnow_state');
    return saved ? JSON.parse(saved) : {
      customerAuth: null,
      adminAuth: null,
      vendorAuth: null,
      deliveryAuth: null,
      cart: [],
      orders: INITIAL_ORDERS
    };
  });

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setAuthLoading(false);
      if (user) {
        // Auto-login as customer when Firebase user is authenticated
        const customerUser: User = {
          id: user.uid,
          email: user.email || '',
          role: 'customer',
          name: user.displayName || user.email?.split('@')[0] || 'Customer'
        };
        setState(prev => ({
          ...prev,
          customerAuth: customerUser
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('bazaarnow_state', JSON.stringify(state));
  }, [state]);

  const login = (user: User) => {
    setState(prev => ({
      ...prev,
      [`${user.role}Auth`]: user
    }));
  };

  const logout = (role: UserRole) => {
    if (role === 'customer' && firebaseUser) {
      signOut(auth);
    }
    setState(prev => ({
      ...prev,
      [`${role}Auth`]: null
    }));
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      let role: UserRole = 'customer';

      if (!userSnap.exists()) {
        // Create new user document
        await setDoc(userRef, {
          name: user.displayName || 'Customer',
          email: user.email,
          role: 'customer',
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        });
      } else {
        // Update last login
        await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
        const userData = userSnap.data();
        if (userData?.role) role = userData.role as UserRole;
      }

      const customerUser: User = {
        id: user.uid,
        email: user.email || '',
        role: role,
        name: user.displayName || user.email?.split('@')[0] || 'Customer'
      };

      setState(prev => ({
        ...prev,
        customerAuth: customerUser
      }));
    } catch (error: any) {
      console.error('Full Google sign-in error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      console.error('Error Code:', error.code);
      console.error('Error Message:', error.message);

      if (error.code === 'auth/network-request-failed') {
        throw new Error('Connection failed. Please ensure "Google" is enabled in Firebase Console > Authentication > Sign-in method.');
      }
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in cancelled.');
      }

      throw new Error(`Firebase Error (${error.code}): ${error.message}`);
    }
  };

  const addToCart = (product: Product, store: Store) => {
    setState(prev => {
      const existing = prev.cart.find(item => item.product.id === product.id);
      if (existing) {
        return {
          ...prev,
          cart: prev.cart.map(item =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        };
      }
      return { ...prev, cart: [...prev.cart, { product, store, quantity: 1 }] };
    });
  };

  const removeFromCart = (productId: string) => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.filter(item => item.product.id !== productId)
    }));
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.map(item => {
        if (item.product.id === productId) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0)
    }));
  };

  const clearCart = () => setState(prev => ({ ...prev, cart: [] }));

  const getCartTotal = () => state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const getCartCount = () => state.cart.reduce((sum, item) => sum + item.quantity, 0);

  const createOrder = (orderData: Partial<Order>): Order => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      items: state.cart,
      total: getCartTotal() + 30,
      deliveryFee: 30,
      status: 'placed',
      customerId: state.customerAuth?.id || 'guest',
      customerName: orderData.customerName || 'Customer',
      customerPhone: orderData.customerPhone || '0000000000',
      address: orderData.address || 'Unknown Address',
      paymentMethod: orderData.paymentMethod || 'COD',
    };
    setState(prev => ({
      ...prev,
      orders: [newOrder, ...prev.orders],
      cart: []
    }));
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setState(prev => ({
      ...prev,
      orders: prev.orders.map(o => o.id === orderId ? { ...o, status } : o)
    }));
  };

  return (
    <AppContext.Provider value={{
      ...state,
      login,
      logout,
      loginWithGoogle,
      firebaseUser,
      authLoading,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      createOrder,
      updateOrderStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
