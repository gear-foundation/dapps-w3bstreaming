import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAccount } from '@gear-js/react-hooks';
import { CreateStreamRestrictModal } from '@/features/Auth/components';
import { LayoutCreateForm } from '@/features/CreateStream/components/LayoutCreateForm';

import { useUsersState } from '@/features/Account/hooks';
import { Loader } from '@/components';

function CreateStreamPage() {
  const { account } = useAccount();
  const { users, isStateRead } = useUsersState();
  const navigate = useNavigate();
  const [isModal, setIsModal] = useState<boolean>(false);

  const handleCloseModal = () => {
    setIsModal(false);
    navigate('/account');
  };

  useEffect(() => {
    if (users && account?.decodedAddress) {
      if (!users[account.decodedAddress]) {
        setIsModal(true);
      } else {
        setIsModal(false);
      }
    }
  }, [users, account?.decodedAddress, isStateRead]);

  return (
    <>
      {isStateRead ? <LayoutCreateForm /> : <Loader wholeScreen />}
      {isModal && <CreateStreamRestrictModal onClose={handleCloseModal} />}
    </>
  );
}

export { CreateStreamPage };
