import { useState } from 'react';
import { MessageCircle, ShoppingBag } from 'lucide-react';
import { Modal } from '../../../ui/Modal';
import { Chip } from '../../../ui/Chip';
import { useCart } from '../../../../hooks/useCart';
import { buildProductMessage, buildWhatsAppUrl } from '../../../../utils/whatsapp';
import { formatPrice } from '../../../../utils/formatPrice';
import type { DisplayProduct } from '../../../../types/perfume';
import styles from './PerfumeModal.module.css';

interface Props {
  perfume: DisplayProduct | null;
  onClose: () => void;
}

function statusTagClass(status: DisplayProduct['status']): string {
  if (status === 'Disponible') return styles.ok;
  if (status === 'Última unidad') return styles.warn;
  if (status === 'Sin stock') return styles.out;
  return '';
}

export function PerfumeModal({ perfume, onClose }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (!perfume) return null;

  const isOut = perfume.status === 'Sin stock';
  const meta = [perfume.brand, perfume.gender, perfume.oilType].filter(Boolean).join(' · ');

  const handleAdd = () => {
    addItem(perfume);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <Modal open={!!perfume} onClose={onClose} labelId="modal-caption">
      <div className={styles.imgWrap}>
        {perfume.image ? (
          <img
            src={perfume.image}
            alt={perfume.name}
            className={styles.img}
          />
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
            Foto no disponible
          </div>
        )}
      </div>

      <p id="modal-caption" className={styles.caption}>{perfume.name}</p>

      <div className={styles.priceRow}>
        <span className={styles.price}>{formatPrice(perfume.price)}</span>
        <span className={[styles.statusTag, statusTagClass(perfume.status)].join(' ')}>
          {perfume.status}
        </span>
      </div>

      <p className={styles.meta}>{meta}</p>

      {perfume.starter && (
        <p className={styles.starter}>Marcado como ideal para empezar</p>
      )}

      <div className={styles.section}>
        <span className={styles.label}>Familia olfativa</span>
        <div className={styles.chips}>
          {perfume.family.map((f) => (
            <Chip key={f}>{f}</Chip>
          ))}
        </div>
      </div>

      {perfume.use.length > 0 && (
        <div className={styles.section}>
          <span className={styles.label}>Uso recomendado</span>
          <div className={styles.chips}>
            {perfume.use.map((u) => (
              <Chip key={u} variant="use">{u}</Chip>
            ))}
          </div>
        </div>
      )}

      {perfume.notes && (
        <div className={styles.section}>
          <span className={styles.label}>Notas</span>
          <p className={styles.notesText}>{perfume.notes}</p>
        </div>
      )}

      <div className={styles.actions}>
        <a
          className={styles.waBtn}
          href={buildWhatsAppUrl(buildProductMessage(perfume))}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={16} />
          {isOut ? 'Consultar reposición por WhatsApp' : 'Consultar por WhatsApp'}
        </a>
        {!isOut && (
          <button type="button" className={styles.addBtn} onClick={handleAdd}>
            <ShoppingBag size={15} />
            {added ? '¡Agregado al carrito!' : 'Agregar al carrito'}
          </button>
        )}
      </div>
    </Modal>
  );
}
