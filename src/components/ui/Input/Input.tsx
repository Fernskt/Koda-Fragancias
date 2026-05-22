import type { InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, id, className, ...rest }: Props) {
  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      <input id={id} className={[styles.input, className].filter(Boolean).join(' ')} {...rest} />
    </div>
  );
}
