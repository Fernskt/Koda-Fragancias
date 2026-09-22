import type { ReactNode } from 'react';
import styles from './Badge.module.css';

type Variant = 'default' | 'ok' | 'warn' | 'out';

interface Props {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  onClick?: () => void;
}

export function Badge({ children, variant = 'default', className, onClick }: Props) {
  const classes = [styles.badge, styles[variant], className].filter(Boolean).join(' ');

  if (onClick) {
    return (
      <button type="button" className={classes} onClick={onClick}>
        {children}
      </button>
    );
  }

  return <span className={classes}>{children}</span>;
}
