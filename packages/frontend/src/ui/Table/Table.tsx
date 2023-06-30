import { useEffect, useState } from 'react';
import { cx } from '@/utils';
import styles from './Table.module.scss';
import {
  TableBodyProps,
  TableCellProps,
  TableHeaderCellProps,
  TableHeaderProps,
  TableProps,
  TableRow,
  TableRowProps,
} from './Table.interfaces';
import { Pagination } from '../Pagination';

function Cell({ className, children }: TableCellProps) {
  return <th className={cx(styles.cell, className)}>{children}</th>;
}

function HeaderCell({ className, children }: TableHeaderCellProps) {
  return <th className={cx(styles['header-cell'], className)}>{children}</th>;
}

function Header({ children }: TableHeaderProps) {
  return (
    <thead className={cx(styles.head)}>
      <tr className={cx(styles.header)}>{children}</tr>
    </thead>
  );
}

function Row({ children }: TableRowProps) {
  return <tr className={cx(styles.row)}>{children}</tr>;
}

function Body({ children }: TableBodyProps) {
  return <tbody className={cx(styles.body)}>{children}</tbody>;
}

function Table({ rows, columns, pagination, renderCell, renderHeaderCell, className }: TableProps) {
  const [tableData, setTableData] = useState<TableRow[]>(rows || []);

  const [currentRows, setCurrentRows] = useState<TableRow[]>(rows || []);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (pagination) {
      const indexOfFirstRow = (currentPage - 1) * pagination.rowsPerPage;

      setCurrentRows(() => tableData.slice(indexOfFirstRow, indexOfFirstRow + pagination.rowsPerPage));
    }
  }, [tableData, pagination, currentPage]);

  useEffect(() => {
    setTableData(rows);
  }, [rows]);

  return (
    <div className={cx(styles.container)}>
      <div className={cx(styles['table-wrapper'])}>
        <table className={cx(styles.table)}>
          <Header>
            {columns.map((item) => (
              <HeaderCell key={item} className={className.headerCell}>
                {renderHeaderCell ? renderHeaderCell(item) : item}
              </HeaderCell>
            ))}
          </Header>
          <Body>
            {tableData?.length ? (
              <>
                {currentRows.map((row) => (
                  <Row key={row.id}>
                    {columns.map((column: string) => (
                      <Cell key={column} className={className.cell}>
                        {renderCell ? renderCell(column, row[column]) : row[column]}
                      </Cell>
                    ))}
                  </Row>
                ))}
              </>
            ) : (
              <tr className={cx(styles['empty-table'])}>
                <td>
                  <h3 className={cx(styles['empty-table-title'])}>No subscribers</h3>
                  <span className={cx(styles['empty-table-caption'])}>You don&apos;t have subscribers yet ...</span>
                </td>
              </tr>
            )}
          </Body>
        </table>
      </div>
      {pagination && (
        <Pagination
          totalRows={tableData.length}
          rowsPerPage={pagination.rowsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}

export { Table };
