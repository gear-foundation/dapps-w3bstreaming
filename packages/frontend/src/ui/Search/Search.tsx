import { cx } from '@/utils';
import { SearchProps } from './Search.interfaces';
import styles from './Search.module.scss';
import searchIcon from '@/assets/icons/search-icon.svg';

function Search({ placeholder = 'Search' }: SearchProps) {
  return (
    <div className={cx(styles.container)}>
      <img src={searchIcon} alt="search" />
      <input type="text" placeholder={placeholder} className={cx(styles.search)} />
    </div>
  );
}

export { Search };
