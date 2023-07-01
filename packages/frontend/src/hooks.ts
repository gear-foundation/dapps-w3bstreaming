import { useEffect, useState, MutableRefObject, RefObject } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProgramMetadata, getProgramMetadata } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { HexString } from '@polkadot/util/types';
import { useAtom } from 'jotai';
import { LOCAL_STORAGE, SEARCH_PARAMS } from '@/consts';
import { Handler } from '@/types';
import { CONTRACT_ADDRESS_ATOM } from '@/atoms';

function useProgramMetadata(source: string) {
  const alert = useAlert();

  const [metadata, setMetadata] = useState<ProgramMetadata>();

  useEffect(() => {
    fetch(source)
      .then((response) => response.text())
      .then((raw) => `0x${raw}` as HexString)
      .then((metaHex) => getProgramMetadata(metaHex))
      .then((result) => setMetadata(result))
      .catch(({ message }: Error) => alert.error(message));
  }, [source, alert]);

  return metadata;
}

function useContractAddress() {
  const [address] = useAtom(CONTRACT_ADDRESS_ATOM);

  return address;
}

function useContractAddressSetup() {
  const [searchParams, setSearchParams] = useSearchParams();

  const address = useContractAddress();

  useEffect(() => {
    if (!address) return;

    localStorage.setItem(LOCAL_STORAGE.CONTRACT_ADDRESS, address);

    searchParams.set(SEARCH_PARAMS.MASTER_CONTRACT_ID, address);
    setSearchParams(searchParams);
  }, [address, searchParams, setSearchParams]);
}

function useClickOutside(handler: Handler, ...refs: (RefObject<HTMLElement> | MutableRefObject<HTMLElement>)[]): void {
  useEffect(() => {
    const listener = (event: Event): void => {
      const existingRefs = refs.filter((item) => item?.current && item);

      const res = existingRefs.every((item) => !item.current?.contains(<Node>event.target));

      if (res) {
        handler(event);
      }
    };

    document.addEventListener('mousedown', listener);

    return (): void => {
      document.removeEventListener('mousedown', listener);
    };
  }, [refs, handler]);
}

export { useProgramMetadata, useContractAddressSetup, useClickOutside };
