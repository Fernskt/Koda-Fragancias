import { useState } from 'react';
import { PerfumeCard } from '../PerfumeCard';
import { PerfumeModal } from '../PerfumeModal';
import { useFilterStore } from '../../../../store/filterStore';
import type { Perfume } from '../../../../types/perfume';
import styles from './CatalogGrid.module.css';

interface Props {
  perfumes: Perfume[];
}

export function CatalogGrid({ perfumes }: Props) {
  const [selected, setSelected] = useState<Perfume | null>(null);
  const reset = useFilterStore((s) => s.reset);

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
          {perfumes.map((p, i) => (
            <div key={p.id} role="listitem">
              <PerfumeCard
                perfume={p}
                onImageClick={setSelected}
                index={i}
              />
            </div>
          ))}
        </div>
      )}

      <PerfumeModal perfume={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
