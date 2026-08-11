import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
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

  if (perfumes.length === 0) return null;

  return (
    <section className={styles.section} aria-label={title}>
      <div className={styles.topline}>
        <span className={styles.iconWrap} aria-hidden="true">
          <Icon size={18} />
        </span>
        <h1 className={styles.heading}>{title}</h1>
      </div>

      <div className={styles.row} role="list">
        {perfumes.map((p, i) => (
          <div key={p.id} className={styles.slide} role="listitem">
            <PerfumeCard perfume={p} onImageClick={setSelected} index={i} />
          </div>
        ))}
      </div>

      <PerfumeModal perfume={selected} onClose={() => setSelected(null)} />
      <Divider />
    </section>
  );
}
