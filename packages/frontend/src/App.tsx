import { Route, Routes } from 'react-router-dom';
import { useAccount, useApi } from '@gear-js/react-hooks';
import { AccountPage, CreateStreamPage, MainPage, StreamPage } from '@/pages';
import { Header, Footer } from '@/components';
import { withProviders } from '@/hocs';
import { cx } from '@/utils';
import { menu, CREATE_STREAM, ACCOUNT, STREAM } from '@/App.routes';
import styles from './App.module.scss';
import { StreamTeasers } from '@/components/StreamTeasers';
// import Watch from './components/Watch';
// import Braodcast from './components/Broadcast';
import 'babel-polyfill';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute/ProtectedRoute';
import { Loader } from './components/Loader';

function AppComponent() {
  const { isApiReady } = useApi();
  const { isAccountReady } = useAccount();

  const isAppReady = isApiReady && isAccountReady;

  return (
    <div className={cx(styles['app-container'])}>
      {isAppReady ? (
        <>
          <Header menu={menu} />
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
                    <StreamPage />
                  </ProtectedRoute>
                }
              />
              {/* <Route path="watch" element={<Watch />} /> */}
              {/* <Route path="broadcast" element={<Braodcast />} /> */}
            </Routes>
          </div>
          <StreamTeasers />
          <Footer />
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}

export const App = withProviders(AppComponent);
