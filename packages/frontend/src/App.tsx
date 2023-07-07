import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { io } from 'socket.io-client';
import { useAccount, useApi } from '@gear-js/react-hooks';
import { AccountPage, CreateStreamPage, MainPage, StreamPage } from '@/pages';
import { Header, Footer } from '@/components';
import { withProviders } from '@/hocs';
import { cx } from '@/utils';
import { routes, CREATE_STREAM, ACCOUNT, STREAM } from '@/App.routes';
import { StreamTeasersList } from '@/features/StreamTeasers';
import { ProtectedRoute } from '@/features/Auth/components/ProtectedRoute/ProtectedRoute';
import { Loader } from './components/Loader';
import styles from './App.module.scss';
import 'babel-polyfill';

function AppComponent() {
  const { isApiReady } = useApi();
  const { isAccountReady } = useAccount();

  const isAppReady = isApiReady && isAccountReady;
  const address = 'wss://w3bstreaming.vara-network.io';

  console.log(process.env);

  const socket: any = io('wss://w3bstreaming.vara-network.io/');

  return (
    <div className={cx(styles['app-container'])}>
      {isAppReady ? (
        <>
          <Header menu={routes} />
          <div className={cx(styles['main-content'])}>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route
                path={`/${ACCOUNT}`}
                element={
                  <ProtectedRoute>
                    <AccountPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path={`/${CREATE_STREAM}`}
                element={
                  <ProtectedRoute>
                    <CreateStreamPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path={`/${STREAM}`}
                element={
                  <ProtectedRoute>
                    <StreamPage socket={socket} />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
          <StreamTeasersList />
          <Footer />
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}

export const App = withProviders(AppComponent);
