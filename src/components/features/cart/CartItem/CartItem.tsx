import { Trash2 } from 'lucide-react';
import { useCart } from '../../../../hooks/useCart';
import { formatPrice } from '../../../../utils/formatPrice';
import type { CartItem as CartItemType } from '../../../../types/perfume';
import styles from './CartItem.module.css';

interface Props {
  item: CartItemType;
}

export function CartItem({ item }: Props) {
  const { removeItem, updateQuantity } = useCart();
  const { perfume, quantity } = item;

  return (
    <div className={styles.item}>
      {perfume.image && (
        <img src={perfume.image} alt={perfume.name} className={styles.img} loading="lazy" />
      )}
      <div className={styles.info}>
        <p className={styles.name}>{perfume.name}</p>
        <p className={styles.brand}>{perfume.brand}</p>
        <p className={styles.price}>{formatPrice(perfume.price)}</p>
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.qtyBtn}
            onClick={() => updateQuantity(perfume.id, quantity - 1)}
            aria-label="Disminuir cantidad"
          >
            −
          </button>
          <span className={styles.qty}>{quantity}</span>
          <button
            type="button"
            className={styles.qtyBtn}
            onClick={() => updateQuantity(perfume.id, quantity + 1)}
            aria-label="Aumentar cantidad"
          >
            +
          </button>
          <button
            type="button"
            className={styles.removeBtn}
            onClick={() => removeItem(perfume.id)}
            aria-label={`Quitar ${perfume.name} del carrito`}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
