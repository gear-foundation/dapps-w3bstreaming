import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAccount } from '@gear-js/react-hooks';
import Identicon from '@polkadot/react-identicon';
import { cx } from '@/utils';
import styles from './BurgerMenu.module.scss';
import { BurgerMenuProps } from './BurgerMenu.interfaces';
import closeMenuIcon from '@/assets/icons/cross-icon.svg';
import { routes } from '@/App.routes';
import { Button } from '@/ui';
import { ADDRESS } from '@/consts';
import { WalletModal } from '@/features/Wallet/components';

function BurgerMenu({ burgerMenuHandler }: BurgerMenuProps) {
  const navigate = useNavigate();
  const { account } = useAccount();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const mobileMenuItems = Object.keys(routes).map((key) => ({
    ...routes[key],
    label: key,
  }));

  const handleMobileMenuClick = (url: string) => {
    navigate(url);
    burgerMenuHandler();
  };

  const handleOpenWalletModal = () => {
    setIsWalletModalOpen(true);
  };

  const handleCloseWalletModal = () => {
    setIsWalletModalOpen(false);
  };

  return (
    <div className={cx(styles['burger-menu'])}>
      <div className={cx(styles['burger-menu-header'])}>
        <div className={cx(styles['burger-menu-close-icon'])}>
          <Button variant="icon" label="" icon={closeMenuIcon} onClick={burgerMenuHandler} />
        </div>
        {account && (
          <button className={cx(styles.description)} onClick={handleOpenWalletModal}>
            <Identicon value={ADDRESS.CONTRACT} size={21} theme="polkadot" className={cx(styles['description-icon'])} />

            <div className={cx(styles['description-name'])}>{account?.meta.name}</div>
          </button>
        )}
      </div>

      <div className={cx(styles['burger-menu-body'])}>
        {mobileMenuItems.map((item) => (
          <Button variant="text" label={item.label} onClick={() => handleMobileMenuClick(item.url)} key={item.label} />
        ))}
      </div>
      {isWalletModalOpen && <WalletModal onClose={handleCloseWalletModal} />}
    </div>
  );
}

export { BurgerMenu };
