import { Route, Routes } from 'react-router-dom';
import { useAccount, useApi } from '@gear-js/react-hooks';
import { AccountPage, CreateStreamPage, MainPage, StreamPage } from '@/pages';
import { Header, Footer } from '@/components';
import { withProviders } from '@/hocs';
import { cx } from '@/utils';
import { menu, CREATE_STREAM, ACCOUNT, STREAM } from '@/App.routes';
import styles from './App.module.scss';
import { StreamTeasersList } from '@/features/StreamTeasers';
import 'babel-polyfill';
import { ProtectedRoute } from '@/features/Auth/components/ProtectedRoute/ProtectedRoute';
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
