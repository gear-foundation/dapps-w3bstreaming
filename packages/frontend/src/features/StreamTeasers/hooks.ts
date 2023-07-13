import { useApi } from '@gear-js/react-hooks';
import { useEffect, useState } from 'react';
import metaTxt from '@/assets/meta/meta.txt';
import { ADDRESS } from '@/consts';
import { StreamTeaserRes, Streams } from './types';
import { useProgramMetadata } from '@/hooks';

function useStreamTeasersState() {
  const programId = ADDRESS.CONTRACT;

  const { api } = useApi();
  const meta = useProgramMetadata(metaTxt);
  const [teasers, setTeasers] = useState<Streams>({});

  useEffect(() => {
    if (meta) {
      api.programState
        .read({ programId }, meta)
        .then((codec) => codec.toHuman())
        .then((res: StreamTeaserRes) => setTeasers((res as any).streams));
    }
  }, [meta, programId, api.programState]);

  return teasers as Streams;
}

export { useStreamTeasersState };
