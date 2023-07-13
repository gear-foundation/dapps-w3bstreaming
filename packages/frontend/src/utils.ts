import clsx from 'clsx';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { Socket, io } from 'socket.io-client';

export const cx = (...styles: string[]) => clsx(...styles);

export const copyToClipboard = (value: string) =>
  navigator.clipboard.writeText(value).then(() => console.log('Copied!'));

const address = process.env.REACT_APP_SIGNALING_SERVER || 'ws://127.0.0.1:3001';

export const socket: Socket = io(address);

function ScrollToTop({ children }: any) {
  const { pathname } = useLocation();

  useEffect(() => {
    const canControlScrollRestoration = 'scrollRestoration' in window.history;
    if (canControlScrollRestoration) {
      window.history.scrollRestoration = 'manual';
    }

    window.scrollTo(0, 0);
  }, [pathname]);

  return children;
}

export { ScrollToTop };
