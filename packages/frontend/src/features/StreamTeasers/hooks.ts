import { ProgramMetadata, getProgramMetadata } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';
import { HexString } from '@polkadot/util/types';
import metaTxt from '@/assets/meta/meta.txt';
import { ADDRESS } from '@/consts';
import { StreamTeaser, StreamTeasers } from './types';

function useProgramMetadata(metaSource: string) {
  const [metadata, setMetadata] = useState<ProgramMetadata>();

  useEffect(() => {
    fetch(metaSource)
      .then((response) => response.text())
      .then((raw) => `0x${raw}` as HexString)
      .then((metaHex) => getProgramMetadata(metaHex))
      .then((result) => setMetadata(result))
      .catch(({ message }: Error) => new Error(message));
  }, [metaSource]);

  return metadata;
}

function useStreamTeasersState() {
  const { api } = useApi();
  const meta = useProgramMetadata(metaTxt);

  const [teasers, setTeasers] = useState<StreamTeaser>([]);

  const programId = ADDRESS.CONTRACT;

  useEffect(() => {
    if (meta) {
      api.programState
        .read({ programId }, meta)
        .then((codec) => codec.toHuman())
        .then((res) => setTeasers(res));
    }
  }, [meta, programId, api.programState]);

  return teasers as StreamTeasers;
}

export { useStreamTeasersState };
// {
//   "1688064064000hey": {
//     "broadcaster": "0xec504317637d775baaafac126fd99c542eddb0358cb4d312ed54836146a10103",
//     "timestamp": "1,658,708,200",
//     "title": "hey",
//     "description": "sdfsddfdsfsdf",
//     "watchers": []
//   }
// }

// {
//   "1688064064000hey": {
//     "broadcaster": "0xec504317637d775baaafac126fd99c542eddb0358cb4d312ed54836146a10103",
//     "timestamp": "1,658,708,200",
//     "title": "hey",
//     "description": "sdfsddfdsfsdf",
//     "watchers": []
//   },
//   "1688065341000some another stream": {
//     "broadcaster": "0xec504317637d775baaafac126fd99c542eddb0358cb4d312ed54836146a10103",
//     "timestamp": "1,658,984,200",
//     "title": "some another stream",
//     "description": "something",
//     "watchers": []
//   }
// }
