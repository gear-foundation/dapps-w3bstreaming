import { cx } from '@/utils';
import styles from './Loader.module.scss';

function Loader() {
  return (
    <div className={cx(styles.container)}>
      <div className={cx(styles['lds-ripple'])}>
        <div />
        <div />
      </div>
    </div>
  );
}

export { Loader };
