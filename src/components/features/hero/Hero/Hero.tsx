import { motion, type Variants } from 'framer-motion';
import { TipsCarousel } from '../../tips/TipsCarousel';
import { perfumes } from '../../../../data/perfumes';
import styles from './Hero.module.css';
import Logo from '../../../../assets/koda-logo.png';

const stagger: Variants = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
};

export function Hero() {
  return (
    <header className={styles.hero}>
      <motion.div className={styles.inner} variants={stagger} initial="initial" animate="animate">
        <div className={styles.intro}>
          <motion.div className={styles.titleRow} variants={fadeUp}>
            <img
              className={styles.logo}
              src={Logo}
              alt="Koda Fragancias"
              loading="eager"
              width={168}
              height={168}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
            <h1 className={styles.title}>Catálogo de Fragancias</h1>
          </motion.div>
          <motion.p className={styles.lead} variants={fadeUp}>
            Perfumería árabe y fragancias disponibles. Catálogo actualizado con filtros por género,
            familias olfativas, uso recomendado, marca y búsqueda rápida.
          </motion.p>
        </div>

        <motion.div className={styles.aside} variants={fadeUp}>
          <TipsCarousel />
          <div className={styles.stats}>
            <div className={styles.stat}>
              <strong className={styles.statValue}>{perfumes.length}</strong>
              <span className={styles.statLabel}>En catálogo</span>
            </div>
            <div className={styles.stat}>
              <strong className={styles.statValue}>20/05/2026</strong>
              <span className={styles.statLabel}>Actualizado</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </header>
  );
}
