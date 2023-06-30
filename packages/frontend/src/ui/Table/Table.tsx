import { useEffect, useState } from 'react';
import { Button } from '@ui';
import { cx } from '@/utils';
import vectorLeft from '@/assets/icons/vector-left.svg';
import vectorRight from '@/assets/icons/vector-right.svg';
import doubleVectorLeft from '@/assets/icons/double-vector-left.svg';
import doubleVectorRight from '@/assets/icons/double-vector-right.svg';
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

function Pagination({ totalRows, rowsPerPage, currentPage, setCurrentPage }: any) {
  const [pageCount, setPageCount] = useState(Math.ceil(totalRows / rowsPerPage));

  useEffect(() => {
    const pages = Math.ceil(totalRows / rowsPerPage);

    if (pages && currentPage > pages) {
      setCurrentPage(pages);
    }

    if (!pages) {
      setCurrentPage(1);
    }

    setPageCount(pages);
  }, [totalRows, rowsPerPage, currentPage, setCurrentPage]);

  return (
    <div className={cx(styles.pagination)}>
      <div className={cx(styles['pagination-left'])}>out of {totalRows}</div>
      <div className={cx(styles['pagination-right'])}>
        <Button
          variant="icon"
          icon={doubleVectorLeft}
          label=""
          disabled={currentPage < 2}
          onClick={() => setCurrentPage(1)}
        />
        <Button
          variant="icon"
          icon={vectorLeft}
          label=""
          disabled={currentPage < 2}
          onClick={() => setCurrentPage(currentPage - 1)}
        />
        <span>{currentPage}</span>
        <span>out of</span>
        <span>{pageCount || 1}</span>
        <Button
          variant="icon"
          icon={vectorRight}
          label=""
          disabled={currentPage > pageCount - 1}
          onClick={() => setCurrentPage(currentPage + 1)}
        />
        <Button
          variant="icon"
          icon={doubleVectorRight}
          label=""
          disabled={currentPage > pageCount - 1}
          onClick={() => setCurrentPage(pageCount)}
        />
      </div>
    </div>
  );
}

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
              <div className={cx(styles['empty-table'])}>
                <h3 className={cx(styles['empty-table-title'])}>No subscribers</h3>
                <span className={cx(styles['empty-table-caption'])}>You don&apos;t have subscribers yet ...</span>
              </div>
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
