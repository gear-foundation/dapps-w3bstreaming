import { useState } from 'react';
import { useAtom } from 'jotai';
import Identicon from '@polkadot/react-identicon';
import { useLocation } from 'react-router-dom';
import { Button, Link } from '@ui';
import { useAccount } from '@gear-js/react-hooks';
import { WalletModal } from '@/features/Wallet/components';
import { cx } from '@/utils';
import styles from './Header.module.scss';
import logo from '@/assets/icons/logo-vara-black.png';
import coin from '@/assets/icons/wara-coin-silver.png';
import { HeaderProps } from './Header.interfaces';
import { ADDRESS, CONTRACT_ADDRESS_ATOM } from '@/consts';

function Header({ menu }: HeaderProps) {
  const location = useLocation();
  const { account } = useAccount();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const address = useAtom(CONTRACT_ADDRESS_ATOM);

  const handleOpenWalletModal = () => {
    setIsWalletModalOpen(true);
  };

  const handleCloseWalletModal = () => {
    setIsWalletModalOpen(false);
  };

  return (
    <>
      <header className={cx(styles.header)}>
        <div className={cx(styles.container)}>
          <Link to="/">
            <img src={logo} alt="" />
          </Link>
          {account ? (
            <>
              <nav className={cx(styles.menu)}>
                {Object.keys(menu).map((item) => {
                  const { url } = menu[item];

                  return (
                    <Link to={url} key={item}>
                      <p
                        className={cx(
                          styles['menu-item'],
                          location.pathname === `/${url}` ? styles['menu-item--active'] : '',
                        )}>
                        {item}
                      </p>
                    </Link>
                  );
                })}
              </nav>
              <div className={cx(styles['wallet-info'])}>
                <div className={cx(styles.balance)}>
                  <img src={coin} alt="wara coin" className={cx(styles['balance-coin-image'])} />
                  <div className={cx(styles['balance-value'])}>{Number(account?.balance.value).toFixed(2)}</div>
                  <div className={cx(styles['balance-currency-name'])}>Vara</div>
                </div>
                <button className={cx(styles.description)} onClick={handleOpenWalletModal}>
                  {address && (
                    <Identicon
                      value={ADDRESS.CONTRACT}
                      size={21}
                      theme="polkadot"
                      className={cx(styles['description-icon'])}
                    />
                  )}
                  <div className={cx(styles['description-name'])}>{account?.meta.name}</div>
                </button>
              </div>
            </>
          ) : (
            <Button label="connect" variant="outline" onClick={handleOpenWalletModal} />
          )}
        </div>
      </header>
      {isWalletModalOpen && <WalletModal onClose={handleCloseWalletModal} />}
    </>
  );
}

export { Header };
