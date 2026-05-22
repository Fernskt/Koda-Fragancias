import type { ReactNode } from 'react';
import styles from './Chip.module.css';

type Variant = 'default' | 'use' | 'filter';

interface Props {
  children: ReactNode;
  variant?: Variant;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Chip({ children, variant = 'default', active, onClick, className }: Props) {
  const classes = [
    styles.chip,
    variant !== 'default' && styles[variant],
    active && styles.active,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (onClick) {
    return (
      <button type="button" className={classes} onClick={onClick} aria-pressed={active}>
        {children}
      </button>
    );
  }

  return <span className={classes}>{children}</span>;
}
