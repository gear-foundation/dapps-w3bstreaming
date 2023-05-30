import { HexString } from '@polkadot/util/types';

import config from '../config';
import { api, stateMeta, stateWasm } from './init';

export async function isUserSubscribed(streamId: string, watcherId: string): Promise<boolean> {
  const isSubscribed = await api.programState.readUsingWasm(
    {
      programId: config.programId as HexString,
      fn_name: 'is_actor_subscribed',
      argument: { streamId, watcherId },
      wasm: stateWasm,
    },
    stateMeta,
  );

  return isSubscribed.toJSON() as boolean;
}
