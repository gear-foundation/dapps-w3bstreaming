import styles from './UsersTable.module.scss';
import { UsersTableProps } from './UsersTable.interfaces';
import { cx } from '@/utils';

function UsersTable({ type = 'withSubscribers' }: UsersTableProps) {
  return <div className={cx(styles.table)}>Users Table {type}</div>;
}

export { UsersTable };
