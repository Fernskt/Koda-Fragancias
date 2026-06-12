import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, DisplayProduct } from '../types/perfume';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (perfume: DisplayProduct) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  total: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (perfume) => {
        set((state) => {
          const existing = state.items.find((i) => i.perfume.id === perfume.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.perfume.id === perfume.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { perfume, quantity: 1 }] };
        });
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.perfume.id !== id) }));
      },

      updateQuantity: (id, qty) => {
        if (qty <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.perfume.id === id ? { ...i, quantity: qty } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      total: () => {
        return get().items.reduce((acc, item) => {
          const raw = item.perfume.price.replace(/\D/g, '');
          const num = parseInt(raw, 10);
          return isNaN(num) ? acc : acc + num * item.quantity;
        }, 0);
      },

      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
    }),
    {
      name: 'koda-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
