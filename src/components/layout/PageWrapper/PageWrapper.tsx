import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import styles from './PageWrapper.module.css';

interface Props {
  children: ReactNode;
}

export function PageWrapper({ children }: Props) {
  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
