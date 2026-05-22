import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTips } from '../../../../hooks/useTips';
import styles from './TipsCarousel.module.css';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const INTERVAL = 6500;

export function TipsCarousel() {
  const { data: tips = [] } = useTips();
  const order = useMemo(() => shuffle(tips), [tips]);
  const [idx, setIdx] = useState(0);
  const orderRef = useRef(order);

  useEffect(() => {
    orderRef.current = order;
    setIdx(0);
  }, [order]);

  useEffect(() => {
    if (order.length === 0) return;
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % orderRef.current.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, [order.length]);

  if (order.length === 0) return null;

  return (
    <div className={styles.card} aria-live="polite" aria-atomic="true">
      <p className={styles.title}>Tips Koda</p>
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          className={styles.text}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
        >
          {order[idx]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
