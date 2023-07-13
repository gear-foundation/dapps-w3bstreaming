import { TableRow } from '@/ui/Table/Table.interfaces';

export interface SubscriptionsData extends TableRow {
  id: string;
  Streamer: string;
  nextWriteOff: string;
}

export interface SubscribersData extends TableRow {
  id: string;
  User: string;
}

export interface UsersTableProps {
  data: SubscriptionsData[] | SubscribersData[];
  columns: string[];
  searchParams: {
    column: string;
  };
  sortedColumns?: string[];
}
