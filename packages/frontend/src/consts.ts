import { HexString } from '@polkadot/util/types';

export const LOCAL_STORAGE = {
  ACCOUNT: 'account',
  WALLET: 'wallet',
  NODE: 'node',
  NODES: 'nodes',
  CONTRACT_ADDRESS: 'simple-nft-contract-address',
};

export const ADDRESS = {
  NODE: 'wss://testnet.vara.rs',
  NODES: 'https://idea.gear-tech.io/gear-nodes',
  CONTRACT: '0xf6d9f8490f5311dfad81a7347ac65e5f3d004ffa811ab571950a1af062adae1d' as HexString,
};

export const SEARCH_PARAMS = {
  MASTER_CONTRACT_ID: 'master',
};
