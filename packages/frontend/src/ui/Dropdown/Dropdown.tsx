import { useState } from 'react';
import { cx } from '@/utils';
import styles from './Dropdown.module.scss';
import { DropdownProps } from './Dropdown.interfaces';
import selectArrow from '@/assets/icons/select-arrow.svg';

function Dropdown({ label, menu }: DropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cx(styles.container)}>
      <button onClick={() => setOpen(!open)} className={cx(styles.dropdown)}>
        <span className={cx(styles['dropdown-label'])}>{label}</span>
        <img
          src={selectArrow}
          alt="chevron"
          className={cx(styles['dropdown-toggle-arrow'], open ? styles['dropdown-toggle-arrow-rotated'] : '')}
        />
      </button>

      {open && (
        <div className={cx(styles['dropdown-menu'])}>
          <ul>
            {Object.keys(menu).map((item) => (
              <li key={menu[item].value} className={cx(styles['dropdown-menu-item'])}>
                {menu[item].label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export { Dropdown };
