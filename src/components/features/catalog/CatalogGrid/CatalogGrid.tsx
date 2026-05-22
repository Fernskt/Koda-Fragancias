import { useEffect, useRef, useState } from 'react';
import { PerfumeCard } from '../PerfumeCard';
import { PerfumeModal } from '../PerfumeModal';
import { useFilterStore } from '../../../../store/filterStore';
import type { Perfume } from '../../../../types/perfume';
import styles from './CatalogGrid.module.css';

const PAGE_SIZE = 6;

interface Props {
  perfumes: Perfume[];
}

export function CatalogGrid({ perfumes }: Props) {
  const [selected, setSelected] = useState<Perfume | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const reset = useFilterStore((s) => s.reset);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Reset visible count whenever the filtered list changes
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
      <div className={styles.topline}>
        <div>
          <p className={styles.overline}>Resultados</p>
          <h2 className={styles.heading}>{perfumes.length} perfumes encontrados</h2>
        </div>
        <button type="button" className={styles.clearBtn} onClick={reset}>
          Limpiar filtros
        </button>
      </div>

      {perfumes.length === 0 ? (
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

      {/* Sentinel — IntersectionObserver triggers here to load more */}
      <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />

      {hasMore && (
        <p className={styles.loadingHint}>Cargando más perfumes…</p>
      )}

      <PerfumeModal perfume={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
