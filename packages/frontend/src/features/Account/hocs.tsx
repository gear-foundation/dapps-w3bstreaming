import { FC, useEffect, useState } from 'react';
import { useAccount } from '@gear-js/react-hooks';
import { Loader } from '@/components';
import { SubscribersData, SubscriptionsData, UsersTableProps } from './components/UsersTable/UsersTable.interfaces';
import { useUsersState } from './hooks';
import { WithDataProps } from './types';

function withData(Component: FC<UsersTableProps>): (props: WithDataProps) => JSX.Element {
  return function Wrapped({ name, ...props }: WithDataProps) {
    const { account } = useAccount();
    const { users, isStateRead } = useUsersState();
    const [subsribersInfo, setSubsribersInfo] = useState<SubscribersData[]>([]);
    const [subScriptionsInfo, setSubscriptionsInfo] = useState<SubscriptionsData[]>([]);

    useEffect(() => {
      if (account && users) {
        const subcribersData =
          users[account.decodedAddress]?.subscribers?.map((id: string) => ({
            id,
            User: users[id] ? `${users[id].name} ${users[id].surname}` : id,
          })) || [];
        const subscriptionsData =
          users[account.decodedAddress]?.subscriptions?.map((user) => ({
            id: user.accountId,
            Streamer: `${users[user.accountId].name} ${users[user.accountId].surname}`,
            nextWriteOff: user.nextWriteOff,
          })) || [];

        setSubsribersInfo(subcribersData);
        setSubscriptionsInfo(subscriptionsData);
      }
    }, [account, users]);

    return (
      <>
        {isStateRead ? (
          <Component {...props} data={name === 'Subscribers' ? subsribersInfo : subScriptionsInfo} />
        ) : (
          <Loader />
        )}
      </>
    );
  };
}

export { withData };
