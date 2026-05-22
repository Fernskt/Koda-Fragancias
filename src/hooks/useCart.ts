import { useCartStore } from '../store/cartStore';

export function useCart() {
  const store = useCartStore();
  return {
    items: store.items,
    isOpen: store.isOpen,
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    openCart: store.openCart,
    closeCart: store.closeCart,
    total: store.total(),
    totalItems: store.totalItems(),
  };
}
