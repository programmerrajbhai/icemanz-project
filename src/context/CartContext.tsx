'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const CART_STORAGE_KEY = 'icemanz_cart';

export interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
  category?: string;
  selectedOptions?: Record<string, string | undefined>;
  addonQuantities?: Record<string, number>;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, amount: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Load cart from localStorage safely (SSR-safe)
function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  // Load cart from localStorage on mount (client-only)
  useEffect(() => {
    const stored = loadCartFromStorage();
    if (stored.length > 0) {
      setCartItems(stored);
    }
    setHydrated(true);
  }, []);

  // Persist cart to localStorage whenever it changes (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // localStorage full or unavailable — fail silently
    }
  }, [cartItems, hydrated]);

  // Calculate subtotal whenever cartItems change
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setSubtotal(total);
  }, [cartItems]);

  const addToCart = (product: any) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      const quantityToAdd = product.quantity || 1;

      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }

      const priceStr = typeof product.price === 'string' ? product.price : String(product.price || '0');
      const price = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;

      return [...prevItems, {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: price,
        image: product.image,
        quantity: quantityToAdd,
        category: product.category,
        selectedOptions: product.selectedOptions || undefined,
        addonQuantities: product.addonQuantities || undefined,
      }];
    });

    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, amount: number) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + amount);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // fail silently
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
