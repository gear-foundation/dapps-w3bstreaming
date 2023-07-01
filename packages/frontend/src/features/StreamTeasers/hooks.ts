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
  const programId = ADDRESS.CONTRACT;

  const { api } = useApi();
  const meta = useProgramMetadata(metaTxt);
  const [teasers, setTeasers] = useState<StreamTeaser>([]);

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
