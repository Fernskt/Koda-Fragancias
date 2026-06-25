import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Chip } from '../../../ui/Chip';
import { useCart } from '../../../../hooks/useCart';
import { buildProductMessage, buildWhatsAppUrl } from '../../../../utils/whatsapp';
import { formatPrice } from '../../../../utils/formatPrice';
import type { Perfume } from '../../../../types/perfume';
import styles from './PerfumeCard.module.css';

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="19" height="19" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

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

  const handleAdd = () => {
    addItem(perfume);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article
      className={[styles.card, isOut ? styles.outOfStock : ''].filter(Boolean).join(' ')}
      style={{ animationDelay: `${Math.min(index * 0.04, 0.5)}s` }}
    >
      <div className={styles.media}>
        <StatusPill status={perfume.status} />
        <button
          type="button"
          className={styles.zoomBtn}
          aria-label={`Ver detalles de ${perfume.name}`}
          onClick={() => onImageClick(perfume)}
        >
          {perfume.perfume_img ? (
            <img
              src={perfume.perfume_img}
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

        <div className={styles.actions}>
          {!isOut && (
            <button type="button" className={styles.addBtn} onClick={handleAdd}>
              <ShoppingBag size={14} aria-hidden="true" />
              {added ? '¡Agregado!' : 'Agregar al carrito'}
            </button>
          )}
          <a
            className={[styles.waBtn, isOut ? styles.waBtnWide : ''].filter(Boolean).join(' ')}
            href={buildWhatsAppUrl(buildProductMessage(perfume))}
            target="_blank"
            rel="noreferrer"
            aria-label={`Consultar ${perfume.name} por WhatsApp`}
          >
            <WhatsAppIcon />
            {isOut && <span>Consultar disponibilidad</span>}
          </a>
        </div>
      </div>
    </article>
  );
}
