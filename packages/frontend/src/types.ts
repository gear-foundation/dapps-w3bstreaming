import { HexString } from '@polkadot/util/types';
import { Streams } from './features/StreamTeasers/types';
import { User } from './features/Account/types';

export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export type Handler = (event: Event) => void;

export interface GlobalState {
  users: { [key: HexString]: User };
  strems: { [key: string]: Streams };
}
