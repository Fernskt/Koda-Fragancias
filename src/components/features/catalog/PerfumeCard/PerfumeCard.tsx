import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, MessageCircle } from 'lucide-react';
import { Chip } from '../../../ui/Chip';
import { useCart } from '../../../../hooks/useCart';
import { buildProductMessage, buildWhatsAppUrl } from '../../../../utils/whatsapp';
import { formatPrice } from '../../../../utils/formatPrice';
import type { Perfume } from '../../../../types/perfume';
import styles from './PerfumeCard.module.css';

interface Props {
  perfume: Perfume;
  onImageClick: (perfume: Perfume) => void;
  index: number;
}

function StatusPill({ status }: { status: Perfume['status'] }) {
  const cls =
    status === 'Disponible'
      ? styles.ok
      : status === 'Última unidad'
      ? styles.warn
      : styles.out;
  return <div className={[styles.statusPill, cls].join(' ')}>{status}</div>;
}

export function PerfumeCard({ perfume, onImageClick, index }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const isOut = perfume.status === 'Sin stock';
  const families = perfume.family.filter((f) => f !== 'Más pedidos').slice(0, 4);
  const uses = perfume.use.slice(0, 3);

  const handleAdd = () => {
    addItem(perfume);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <motion.article
      className={[styles.card, isOut ? styles.outOfStock : ''].filter(Boolean).join(' ')}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.5), ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -3 }}
      layout
    >
      <div className={styles.media}>
        <StatusPill status={perfume.status} />
        <button
          type="button"
          className={styles.zoomBtn}
          aria-label={`Ver detalles de ${perfume.name}`}
          onClick={() => onImageClick(perfume)}
        >
          {perfume.image ? (
            <img
              src={perfume.image}
              alt={perfume.name}
              loading="lazy"
              className={styles.img}
              onError={(e) => {
                const el = e.currentTarget;
                el.style.display = 'none';
                el.parentElement?.insertAdjacentHTML(
                  'beforeend',
                  `<div class="${styles.placeholder}"><div><b>${perfume.name}</b><span>Foto pendiente</span></div></div>`
                );
              }}
            />
          ) : (
            <div className={styles.placeholder}>
              <div>
                <b>{perfume.name}</b>
                <span>Foto pendiente</span>
              </div>
            </div>
          )}
        </button>
      </div>

      <div className={styles.body}>
        <div>
          <h3 className={styles.name}>{perfume.name}</h3>
          <p className={styles.brand}>
            {perfume.brand} · {perfume.gender}
          </p>
        </div>

        <p className={styles.price}>{formatPrice(perfume.price)}</p>

        <div className={styles.chips}>
          {families.map((f) => (
            <Chip key={f}>{f}</Chip>
          ))}
        </div>

        <p className={styles.notes}>
          <strong>Notas:</strong> {perfume.notes}
        </p>

        {/* <div className={styles.avail}>{perfume.status}</div> */}

        <div className={styles.chips}>
          {uses.map((u) => (
            <Chip key={u} variant="use">
              {u}
            </Chip>
          ))}
        </div>

        <div className={styles.actions}>
          <a
            className={styles.waBtn}
            href={buildWhatsAppUrl(buildProductMessage(perfume))}
            target="_blank"
            rel="noreferrer"
            aria-label={`Consultar ${perfume.name} por WhatsApp`}
          >
            <MessageCircle size={15} aria-hidden="true" />
            {isOut ? 'Consultar reposición' : 'Consultar por WhatsApp'}
          </a>
          {!isOut && (
            <button type="button" className={styles.addBtn} onClick={handleAdd}>
              <ShoppingBag size={14} aria-hidden="true" />
              {added ? '¡Agregado!' : 'Agregar al carrito'}
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
