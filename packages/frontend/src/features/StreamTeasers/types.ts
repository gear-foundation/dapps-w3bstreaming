import { AnyJson } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';

export interface StreamTeaserProps {
  broadcaster: HexString;
  timestamp: string;
  title: string;
  description?: string;
  watchers: [];
}

export interface StreamTeasers {
  [key: string]: {
    broadcaster: HexString;
    timestamp: string;
    title: string;
    description?: string;
    watchers: [];
  };
}

export type StreamTeaser =
  | string
  | number
  | boolean
  | AnyJson[]
  | {
      [index: string]: AnyJson;
    }
  | null
  | undefined;

export interface FormattedTeaser {
  broadcaster: HexString;
  timestamp: string;
  title: string;
  description?: string;
  watchers: [];
}
