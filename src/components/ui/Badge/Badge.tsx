import type { ReactNode } from 'react';
import styles from './Badge.module.css';

type Variant = 'default' | 'ok' | 'warn' | 'out';

interface Props {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

export function Badge({ children, variant = 'default', className }: Props) {
  return (
    <span className={[styles.badge, styles[variant], className].filter(Boolean).join(' ')}>
      {children}
    </span>
  );
}
