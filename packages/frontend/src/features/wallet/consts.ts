import { Entries } from '@/types';
import EnkryptSVG from '@/assets/icons/enkrypt-icon.svg';
import PolkadotSVG from '@/assets/icons/polkadot-js-icon.svg';
import SubWalletSVG from '@/assets/icons/sub-wallet-icon.svg';
import TalismanSVG from '@/assets/icons/talisman-icon.svg';

const WALLET = {
  enkrypt: { name: 'Enkrypt', SVG: EnkryptSVG },
  'polkadot-js': { name: 'Polkadot JS', SVG: PolkadotSVG },
  'subwallet-js': { name: 'SubWallet', SVG: SubWalletSVG },
  talisman: { name: 'Talisman', SVG: TalismanSVG },
};

const WALLETS = Object.entries(WALLET) as Entries<typeof WALLET>;

export { WALLET, WALLETS };
