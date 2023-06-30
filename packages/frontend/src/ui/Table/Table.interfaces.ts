export type CellValue = string | number | null | undefined;
export interface TableRow {
  id: string | number;
  [key: string]: CellValue;
}

export interface TableProps {
  rows: TableRow[];
  columns: string[];
  sortedColumns?: string[];
  pagination?: Pagination;
  renderCell?: (columnName: string | number, value: CellValue) => CellValue | JSX.Element;
  renderHeaderCell?: (name: string | number) => CellValue;
  className: {
    headerCell: string;
    cell: string;
  };
}

export interface TableHeaderProps {
  children: JSX.Element[];
}

export interface TableBodyProps {
  children: JSX.Element;
}

export interface TableRowProps {
  children: JSX.Element[];
}

export interface TableHeaderCellProps {
  className: string;
  children: CellValue | JSX.Element;
}

export interface TableCellProps {
  className: string;
  children: CellValue | JSX.Element;
}

export interface Pagination {
  rowsPerPage: number;
}