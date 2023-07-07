import { useSendMessage } from '@gear-js/react-hooks';
import { ADDRESS } from '@/consts';
import { useMetadata } from '@/hooks';
import metaTxt from '@/assets/meta/meta.txt';

function useCreateStreamMetadata() {
  return useMetadata(metaTxt);
}

function useSubscribeToStreamMessage() {
  const meta = useCreateStreamMetadata();

  return useSendMessage(ADDRESS.CONTRACT, meta);
}

export { useSubscribeToStreamMessage };
