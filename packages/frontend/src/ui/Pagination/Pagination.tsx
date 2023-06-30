import { useEffect, useState } from 'react';
import vectorLeft from '@/assets/icons/vector-left.svg';
import vectorRight from '@/assets/icons/vector-right.svg';
import doubleVectorLeft from '@/assets/icons/double-vector-left.svg';
import doubleVectorRight from '@/assets/icons/double-vector-right.svg';
import { Button } from '../Button';
import styles from './Pagination.module.scss';
import { cx } from '@/utils';

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

export { Pagination };
