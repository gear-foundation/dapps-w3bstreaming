import { cx } from '@/utils';
import styles from './Button.module.scss';
import { ButtonProps } from './Button.interfaces';

function Button({ label = '', type = 'button', ...props }: ButtonProps) {
  return (
    <button className={cx(styles.button)} type={type} {...props}>
      {label}
    </button>
  );
}

export { Button };
