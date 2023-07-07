import styles from './UsersTable.module.scss';
import { UsersTableProps } from './UsersTable.interfaces';
import { cx } from '@/utils';
import { Table } from '@/ui';
import img from '@/assets/icons/streamer-table-img.png';
import { CellValue } from '@/ui/Table/Table.interfaces';

function Cell(columnName: string | number, value: CellValue) {
  if (columnName === 'Action') {
    return <button className={cx(styles['unsubscribe-cell'])}>Unsubscribe</button>;
  }

  if (columnName === 'Streamer' || columnName === 'User') {
    return (
      <div className={cx(styles['streamer-cell'])}>
        <img src={img} alt="img" />
        <span className={cx(styles['streamer-cell-name'])}>{value}</span>
      </div>
    );
  }

  return value;
}

function UsersTable({ data, columns, searchParams, sortedColumns }: UsersTableProps) {
  return (
    <div className={cx(styles.table)}>
      <Table
        rows={data}
        pagination={{ rowsPerPage: 10 }}
        columns={columns}
        renderCell={Cell}
        className={{
          headerCell: cx(styles['header-cell']),
          cell: cx(styles.cell),
        }}
        searchParams={{ ...searchParams, placeholder: 'Search transactions' }}
        sortedColumns={sortedColumns}
      />
    </div>
  );
}

export { UsersTable };
