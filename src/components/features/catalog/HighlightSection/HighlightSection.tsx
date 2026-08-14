import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react';
import { PerfumeCard } from '../PerfumeCard';
import { PerfumeModal } from '../PerfumeModal';
import { Divider } from '../../../ui/Divider';
import type { Perfume } from '../../../../types/perfume';
import styles from './HighlightSection.module.css';

interface Props {
  title: string;
  icon: LucideIcon;
  perfumes: Perfume[];
}

export function HighlightSection({ title, icon: Icon, perfumes }: Props) {
  const [selected, setSelected] = useState<Perfume | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    // El padding + scroll-snap del row hace que el reposo natural quede en ~18px
    // (no en 0), así que se usa un margen mayor para no mostrar la flecha "Anterior"
    // cuando en realidad no se movió el carrusel.
    const EDGE_TOLERANCE = 24;
    setCanScrollLeft(el.scrollLeft > EDGE_TOLERANCE);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - EDGE_TOLERANCE);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = rowRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState, perfumes]);

  const scrollByPage = (direction: 1 | -1) => {
    const el = rowRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: 'smooth' });
  };

  if (perfumes.length === 0) return null;

  return (
    <section className={styles.section} aria-label={title}>
      <div className={styles.topline}>
        <span className={styles.iconWrap} aria-hidden="true">
          <Icon size={18} />
        </span>
        <h1 className={styles.heading}>{title}</h1>
      </div>

      <div className={styles.carousel}>
        <button
          type="button"
          className={`${styles.navBtn} ${styles.navPrev}`}
          onClick={() => scrollByPage(-1)}
          disabled={!canScrollLeft}
          aria-label="Anterior"
        >
          <ChevronLeft size={20} />
        </button>

        <div className={styles.row} role="list" ref={rowRef}>
          {perfumes.map((p, i) => (
            <div key={p.id} className={styles.slide} role="listitem">
              <PerfumeCard perfume={p} onImageClick={setSelected} index={i} />
            </div>
          ))}
        </div>

        <button
          type="button"
          className={`${styles.navBtn} ${styles.navNext}`}
          onClick={() => scrollByPage(1)}
          disabled={!canScrollRight}
          aria-label="Siguiente"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <PerfumeModal perfume={selected} onClose={() => setSelected(null)} />
      <Divider />
    </section>
  );
}
