import { TableRow } from '@/ui/Table/Table.interfaces';

export interface SubscriptionsData extends TableRow {
  id: number;
  Streamer: string;
  'Subscription Date': string;
  'Date of next write-off': string;
}

export interface SubscribersData extends TableRow {
  id: number;
  User: string;
  'Subscription Date': string;
  'Last payment date': string;
  'Date of next write-off': string;
}

export interface UsersTableProps {
  data: SubscriptionsData[] | SubscribersData[];
  columns: string[];
}
