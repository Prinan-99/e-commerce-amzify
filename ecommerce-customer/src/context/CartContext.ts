import { createContext } from 'react';
import { CartItem, Product } from '../types/types';

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);