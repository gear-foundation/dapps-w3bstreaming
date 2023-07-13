import { atom } from 'jotai';
import { ADDRESS } from '@/consts';
import { Streams } from './features/StreamTeasers/types';

export const CONTRACT_ADDRESS_ATOM = atom(ADDRESS.CONTRACT);

export const STREAM_TEASERS_ATOM = atom<Streams | null>(null);
