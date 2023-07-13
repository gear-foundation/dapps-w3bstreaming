import { useReadFullState, useSendMessage } from '@gear-js/react-hooks';
import metaTxt from '@/assets/meta/meta.txt';
import { ADDRESS } from '@/consts';
import { UsersRes } from './types';
import { useMetadata, useProgramMetadata } from '@/hooks';

function useUsersState() {
  const programId = ADDRESS.CONTRACT;
  const meta = useProgramMetadata(metaTxt);
  const { state, isStateRead } = useReadFullState(programId, meta);

  return { users: (state as any)?.users as UsersRes, isStateRead };
}

function useEditProfileMetadata() {
  return useMetadata(metaTxt);
}

function useEditProfileMessage() {
  const meta = useEditProfileMetadata();

  return useSendMessage(ADDRESS.CONTRACT, meta);
}

export { useUsersState, useEditProfileMessage };
