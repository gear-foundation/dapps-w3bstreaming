import { TabPanel } from '@ui';
import { UsersTable } from '@/features/account/components/UsersTable/UsersTable';

const tabs = {
  subscriptions: {
    name: 'Subscriptions',
    component: () => <UsersTable type="withSubscriptions" />,
  },
  subscribers: {
    name: 'Subscribers',
    component: () => <UsersTable type="withSubscribers" />,
  },
};

function AccountPage() {
  return (
    <div>
      My Account
      <TabPanel tabs={tabs} />
    </div>
  );
}

export { AccountPage };
