import { useEffect, useRef, useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { PerfumeCard } from '../PerfumeCard';
import { PerfumeModal } from '../PerfumeModal';
import { useFilterStore } from '../../../../store/filterStore';
import { useStoreConfig } from '../../../../hooks/useStoreConfig';
import type { Perfume } from '../../../../types/perfume';
import styles from './CatalogGrid.module.css';

const WA_FALLBACK = '5491156009539';
const WA_EMPTY_MSG = encodeURIComponent(
  'Hola Koda Fragancias! No encontré lo que buscaba en el catálogo. ¿Me podés ayudar con disponibilidad?'
);

const PAGE_SIZE = 6;

function CardSkeleton({ delay }: { delay: number }) {
  return (
    <div className={styles.skeletonCard} aria-hidden="true" style={{ animationDelay: `${delay}s` }}>
      <div className={styles.skeletonMedia} />
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonLine} style={{ width: '68%' }} />
        <div className={styles.skeletonLine} style={{ width: '42%', height: 10 }} />
        <div className={styles.skeletonLine} style={{ width: '30%', height: 20 }} />
        <div className={styles.skeletonChips}>
          <div className={styles.skeletonChip} />
          <div className={styles.skeletonChip} style={{ width: 48 }} />
          <div className={styles.skeletonChip} style={{ width: 80 }} />
        </div>
        <div className={styles.skeletonBlock} />
        <div className={styles.skeletonChips}>
          <div className={styles.skeletonChip} />
          <div className={styles.skeletonChip} style={{ width: 52 }} />
        </div>
        <div className={styles.skeletonBtn} />
      </div>
    </div>
  );
}

interface Props {
  perfumes: Perfume[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export function CatalogGrid({ perfumes, isLoading, isError, onRetry }: Props) {
  const [selected, setSelected] = useState<Perfume | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const reset = useFilterStore((s) => s.reset);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { data: config } = useStoreConfig();
  const waNumber = config?.whatsapp_number ?? WA_FALLBACK;
  const waHref = `https://wa.me/${waNumber}?text=${WA_EMPTY_MSG}`;

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [perfumes]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible((v) => Math.min(v + PAGE_SIZE, perfumes.length));
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [perfumes.length]);

  const shown = perfumes.slice(0, visible);
  const hasMore = visible < perfumes.length;

  return (
    <section className={styles.section}>
      {!isLoading && !isError && (
        <div className={styles.topline}>
          <div>
            <p className={styles.overline}>Resultados</p>
            <h2 className={styles.heading}>{perfumes.length} perfumes encontrados</h2>
          </div>
          <button type="button" className={styles.clearBtn} onClick={reset}>
            Limpiar filtros
          </button>
        </div>
      )}

      {isLoading ? (
        <div className={styles.grid} aria-label="Cargando catálogo" aria-busy="true">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <CardSkeleton key={i} delay={i * 0.07} />
          ))}
        </div>
      ) : isError ? (
        <div className={styles.errorWrap} role="alert">
          <AlertCircle size={40} className={styles.errorIcon} />
          <h3 className={styles.errorTitle}>No pudimos cargar el catálogo</h3>
          <p className={styles.errorMsg}>
            Revisá tu conexión a internet o intentalo de nuevo en unos segundos.
          </p>
          {onRetry && (
            <button className={styles.retryBtn} onClick={onRetry}>
              <RefreshCw size={15} />
              Reintentar
            </button>
          )}
        </div>
      ) : perfumes.length === 0 ? (
        <div className={styles.empty}>
          <h3>No encontré perfumes con esos filtros</h3>
          <p>Probá limpiar la búsqueda o consultanos por disponibilidad.</p>
          <div className={styles.emptyActions}>
            <button type="button" className={styles.emptyClearBtn} onClick={reset}>
              Limpiar filtros
            </button>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.emptyWaBtn}
            >
              <svg width="17" height="17" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
                <path d="M16.04 3C8.87 3 3.05 8.8 3.05 15.95c0 2.3.61 4.54 1.77 6.5L3 29l6.72-1.76a12.9 12.9 0 0 0 6.32 1.61h.01C23.2 28.85 29 23.05 29 15.9 29 8.78 23.2 3 16.04 3Zm0 23.65h-.01a10.72 10.72 0 0 1-5.46-1.49l-.39-.23-3.99 1.05 1.07-3.88-.25-.4a10.7 10.7 0 0 1-1.64-5.75c0-5.93 4.83-10.75 10.78-10.75 2.88 0 5.58 1.12 7.62 3.15a10.65 10.65 0 0 1 3.16 7.58c0 5.9-4.83 10.72-10.78 10.72Zm5.9-8.04c-.32-.16-1.9-.94-2.2-1.05-.3-.11-.52-.16-.74.16-.22.32-.85 1.05-1.04 1.27-.19.22-.38.24-.7.08-.32-.16-1.36-.5-2.6-1.6-.96-.86-1.6-1.92-1.79-2.24-.19-.32-.02-.5.14-.66.14-.14.32-.38.48-.57.16-.19.22-.32.32-.54.11-.22.05-.41-.03-.57-.08-.16-.74-1.78-1.01-2.44-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.57.08-.87.41-.3.32-1.14 1.11-1.14 2.72s1.17 3.15 1.33 3.37c.16.22 2.3 3.51 5.57 4.92.78.34 1.39.54 1.86.69.78.25 1.49.21 2.05.13.63-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.14-.3-.22-.62-.38Z" />
              </svg>
              Consultar disponibilidad
            </a>
          </div>
        </div>
      ) : (
        <div className={styles.grid} role="list">
          {shown.map((p, i) => (
            <div key={p.id} role="listitem">
              <PerfumeCard perfume={p} onImageClick={setSelected} index={i} />
            </div>
          ))}
        </div>
      )}

      <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />

      {hasMore && (
        <p className={styles.loadingHint}>Cargando más perfumes…</p>
      )}

      <PerfumeModal perfume={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
