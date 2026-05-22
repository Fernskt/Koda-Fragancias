import { useEffect, useRef, useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { PerfumeCard } from '../PerfumeCard';
import { PerfumeModal } from '../PerfumeModal';
import { useFilterStore } from '../../../../store/filterStore';
import type { Perfume } from '../../../../types/perfume';
import styles from './CatalogGrid.module.css';

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
          <p>Probá limpiar la búsqueda o cambiar una categoría.</p>
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
