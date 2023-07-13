import { HexString } from '@gear-js/api';

export interface User {
  name: string;
  surname: string;
  imgLink: string;
  streamIds: [string[]];
  subscribers: any[];
  subscriptions: any[];
  role: string;
}

export interface UsersRes {
  [key: HexString]: User;
}
