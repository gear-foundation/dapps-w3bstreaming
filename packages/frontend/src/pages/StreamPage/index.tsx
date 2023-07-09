import { useAtomValue } from 'jotai';
import { useParams } from 'react-router';
import { useAccount } from '@gear-js/react-hooks';
import { Watch, Broadcast } from '@/features/Stream/components';

import { STREAM_TEASERS_ATOM } from '@/atoms';
import { Layout } from '@/features/Stream/components/Layout';

function StreamPage({ socket }: any) {
  const { account } = useAccount();
  const { id: streamId } = useParams();
  const streamTeasers = useAtomValue(STREAM_TEASERS_ATOM);

  return (
    <div>
      {streamTeasers?.[streamId as string] && (
        <>
          <div>
            {account?.decodedAddress === streamTeasers[streamId as string].broadcaster ? (
              <Broadcast socket={socket} streamId={streamId} />
            ) : (
              <Watch socket={socket} streamId={streamId} />
            )}
          </div>
          <Layout isBroadcaster={account?.decodedAddress === streamTeasers[streamId as string].broadcaster} />
        </>
      )}
    </div>
  );
}

export { StreamPage };
