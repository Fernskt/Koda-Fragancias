import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ShoppingBag, MessageCircle } from 'lucide-react';
import { CartItem } from '../CartItem';
import { useCart } from '../../../../hooks/useCart';
import { buildCartMessage, buildWhatsAppUrl } from '../../../../utils/whatsapp';
import styles from './CartDrawer.module.css';

export function CartDrawer() {
  const { items, isOpen, closeCart, clearCart, total } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeCart]);

  const waUrl =
    items.length > 0
      ? buildWhatsAppUrl(buildCartMessage(items))
      : '#';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className={styles.backdrop}
            onClick={closeCart}
            aria-hidden="true"
          />
          <motion.div
            className={styles.drawer}
            role="dialog"
            aria-modal="true"
            aria-label="Carrito de compras"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className={styles.header}>
              <h2 className={styles.title}>Tu carrito</h2>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={closeCart}
                aria-label="Cerrar carrito"
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.items}>
              {items.length === 0 ? (
                <div className={styles.empty}>
                  <ShoppingBag size={42} />
                  <p>Tu carrito está vacío.</p>
                  <p style={{ fontSize: 13 }}>
                    Agregá perfumes para armar tu pedido.
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <CartItem key={item.perfume.id} item={item} />
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>Total estimado</span>
                  <span className={styles.totalValue}>
                    ${total.toLocaleString('es-AR')}
                  </span>
                </div>
                <a
                  className={styles.sendBtn}
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={closeCart}
                >
                  <MessageCircle size={16} />
                  Enviar pedido por WhatsApp
                </a>
                <button
                  type="button"
                  className={styles.clearBtn}
                  onClick={clearCart}
                >
                  Vaciar carrito
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
