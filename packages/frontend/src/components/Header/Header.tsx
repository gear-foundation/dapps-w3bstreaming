import { useEffect, useState } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import Identicon from '@polkadot/react-identicon';
import { useLocation } from 'react-router-dom';
import { Button, Link } from '@ui';
import { useAccount } from '@gear-js/react-hooks';
import { WalletModal } from '@/features/Wallet/components';
import { cx } from '@/utils';
import styles from './Header.module.scss';
import logo from '@/assets/icons/logo.png';
import coin from '@/assets/icons/vara-coin-silver.png';
import { HeaderProps } from './Header.interfaces';
import { ADDRESS } from '@/consts';
import { CONTRACT_ADDRESS_ATOM, STREAM_TEASERS_ATOM } from '@/atoms';
import { useStreamTeasersState } from '@/features/StreamTeasers/hooks';
import { useMediaQuery } from '@/hooks';
import menuIcon from '@/assets/icons/burger-menu-icon.svg';
import { BurgerMenu } from '../BurgerMenu/BurgerMenu';

function Header({ menu }: HeaderProps) {
  const location = useLocation();
  const { account } = useAccount();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const address = useAtom(CONTRACT_ADDRESS_ATOM);
  const setStreamTeasers = useSetAtom(STREAM_TEASERS_ATOM);
  const isMobile = useMediaQuery(600);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const { streamTeasers } = useStreamTeasersState();

  const burgerMenuHandler = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (streamTeasers) {
      setStreamTeasers(streamTeasers);
    }
  }, [streamTeasers, setStreamTeasers]);

  useEffect(() => {
    if (isMobileMenuOpen && !isMobile) {
      burgerMenuHandler();
    }
  }, [isMobile, isMobileMenuOpen]);

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
              {!isMobile && (
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
                      <div className={cx(styles['balance-value'])}>{account.balance.value}</div>
                      <div className={cx(styles['balance-currency-name'])}>{account.balance.unit}</div>
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
              )}
            </>
          ) : (
            <Button label="connect" variant="outline" onClick={handleOpenWalletModal} />
          )}
          {account && isMobile && (
            <div className={cx(styles['burger-menu-button'])}>
              <Button label="" variant="icon" onClick={() => setIsMobileMenuOpen(true)} icon={menuIcon} />
            </div>
          )}
        </div>
      </header>
      {isMobileMenuOpen && (
        <>
          <div className={cx(styles['blur-background'])} />
          <BurgerMenu burgerMenuHandler={burgerMenuHandler} />
        </>
      )}

      {isWalletModalOpen && <WalletModal onClose={handleCloseWalletModal} />}
    </>
  );
}

export { Header };
