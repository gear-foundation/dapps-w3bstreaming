import { UsersTable } from './components/UsersTable';
import { SUBSCRIBERS_USERS_TABLE_COLUMNS, SUBSCRIPTIONS_USERS_TABLE_COLUMNS } from './consts';
import { withData } from './hocs';

const UsersTableWithData = withData(UsersTable);

export const tabs = {
  subscriptions: {
    name: 'Subscriptions',
    component: () => (
      <UsersTableWithData
        columns={SUBSCRIPTIONS_USERS_TABLE_COLUMNS}
        searchParams={{ column: 'Streamer' }}
        sortedColumns={['Streamer', 'Subscription Date', 'Date of next write-off']}
      />
    ),
  },
  subscribers: {
    name: 'Subscribers',
    component: () => (
      <UsersTableWithData
        columns={SUBSCRIBERS_USERS_TABLE_COLUMNS}
        searchParams={{ column: 'User' }}
        sortedColumns={['User', 'Subscription Date', 'Last payment date', 'Date of next write-off']}
      />
    ),
  },
};
