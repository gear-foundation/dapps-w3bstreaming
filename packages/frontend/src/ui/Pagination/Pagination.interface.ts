export interface PaginationProps {
  totalRows: number;
  rowsPerPage: number;
  currentPage: number;
  setCurrentPage: () => void;
}
