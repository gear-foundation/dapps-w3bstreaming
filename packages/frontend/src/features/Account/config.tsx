import { UsersTable } from './components/UsersTable';
import { SUBSCRIBERS_USERS_TABLE_COLUMNS, SUBSCRIPTIONS_USERS_TABLE_COLUMNS } from './consts';

export const subscriptionsMocked = [
  // {
  //   id: 1,
  //   Streamer: 'John Bin',
  //   'Subscription Date': '10.08.2023',
  //   'Date of next write-off': '13.09.2023',
  // },
  // {
  //   id: 2,
  //   Streamer: 'John Bin',
  //   'Subscription Date': '10.08.2023',
  //   'Date of next write-off': '13.09.2023',
  // },
  // {
  //   id: 3,
  //   Streamer: 'John Bin',
  //   'Subscription Date': '10.08.2023',
  //   'Date of next write-off': '13.09.2023',
  // },
  // {
  //   id: 4,
  //   Streamer: 'John Bin',
  //   'Subscription Date': '10.08.2023',
  //   'Date of next write-off': '13.09.2023',
  // },
  // {
  //   id: 5,
  //   Streamer: 'John Bin',
  //   'Subscription Date': '10.08.2023',
  //   'Date of next write-off': '13.09.2023',
  // },
  // {
  //   id: 6,
  //   Streamer: 'John Bin',
  //   'Subscription Date': '10.08.2023',
  //   'Date of next write-off': '13.09.2023',
  // },
];

export const subscribersMocked = [
  //MOCKED
  {
    id: 1,
    User: 'John Bin',
    'Subscription Date': '10.08.2023',
    'Last payment date': '10.08.2023',
    'Date of next write-off': '13.09.2023',
  },
  {
    id: 2,
    User: 'John Bin',
    'Subscription Date': '10.08.2023',
    'Last payment date': '10.08.2023',
    'Date of next write-off': '13.09.2023',
  },
  {
    id: 3,
    User: 'John Bin',
    'Subscription Date': '10.08.2023',
    'Last payment date': '10.08.2023',
    'Date of next write-off': '13.09.2023',
  },
  {
    id: 4,
    User: 'John Bin',
    'Subscription Date': '10.08.2023',
    'Last payment date': '10.08.2023',
    'Date of next write-off': '13.09.2023',
  },
  {
    id: 5,
    User: 'John Bin',
    'Subscription Date': '10.08.2023',
    'Last payment date': '10.08.2023',
    'Date of next write-off': '13.09.2023',
  },
  {
    id: 6,
    User: 'John Bin',
    'Subscription Date': '10.08.2023',
    'Last payment date': '10.08.2023',
    'Date of next write-off': '13.09.2023',
  },
  {
    id: 7,
    User: 'John Bin',
    'Subscription Date': '10.08.2023',
    'Last payment date': '10.08.2023',
    'Date of next write-off': '13.09.2023',
  },
  {
    id: 8,
    User: 'John Bin',
    'Subscription Date': '10.08.2023',
    'Last payment date': '10.08.2023',
    'Date of next write-off': '13.09.2023',
  },
  {
    id: 9,
    User: 'John Bin',
    'Subscription Date': '10.08.2023',
    'Last payment date': '10.08.2023',
    'Date of next write-off': '13.09.2023',
  },
  {
    id: 10,
    User: 'John Bin',
    'Subscription Date': '10.08.2023',
    'Last payment date': '10.08.2023',
    'Date of next write-off': '13.09.2023',
  },
  {
    id: 11,
    User: 'John Bin',
    'Subscription Date': '10.08.2023',
    'Last payment date': '10.08.2023',
    'Date of next write-off': '13.09.2023',
  },
  {
    id: 12,
    User: 'John Bin',
    'Subscription Date': '10.08.2023',
    'Last payment date': '10.08.2023',
    'Date of next write-off': '13.09.2023',
  },
];

export const tabs = {
  subscriptions: {
    name: 'Subscriptions',
    component: () => <UsersTable data={subscriptionsMocked} columns={SUBSCRIPTIONS_USERS_TABLE_COLUMNS} />,
  },
  subscribers: {
    name: 'Subscribers',
    component: () => <UsersTable data={subscribersMocked} columns={SUBSCRIBERS_USERS_TABLE_COLUMNS} />,
  },
};