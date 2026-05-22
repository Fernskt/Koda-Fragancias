import { forwardRef } from 'react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

type Variant = 'primary' | 'ghost' | 'whatsapp';
type Size = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  full?: boolean;
}

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' };
type AnchorProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a' };

type Props = ButtonProps | AnchorProps;

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, Props>(
  ({ variant = 'primary', size = 'md', full, className, ...rest }, ref) => {
    const classes = [
      styles.btn,
      styles[variant],
      size !== 'md' && styles[size],
      full && styles.full,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    if ('as' in rest && rest.as === 'a') {
      const { as: _as, ...anchorProps } = rest as AnchorProps;
      return <a ref={ref as React.Ref<HTMLAnchorElement>} className={classes} {...anchorProps} />;
    }

    const { as: _as, ...btnProps } = rest as ButtonProps;
    return <button ref={ref as React.Ref<HTMLButtonElement>} className={classes} {...btnProps} />;
  }
);

Button.displayName = 'Button';
