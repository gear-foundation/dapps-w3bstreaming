import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { SignerResult } from '@polkadot/api/types';
import { stringToHex } from '@polkadot/util';
import { useAccount } from '@gear-js/react-hooks';
import styles from './Watch.module.scss';
import { cx } from '@/utils';
import { StreamState } from './Watch.interface';
import { Player } from '../Player';
import { Loader } from '@/components';
import { RTC_CONFIG } from '../../config';
import { Button } from '@/ui';

interface IOfferMsg {
  userId: string;
  description: RTCSessionDescription;
  streamId: string;
}

interface ICandidateMsg {
  id: string;
  candidate: RTCIceCandidate;
}

interface IStreamUpdateMsg {
  type: 'muted' | 'playing' | 'shared' | 'finished';
  stream: MediaStream;
}

function Watch({ socket, streamId }: any) {
  const remoteVideo: MutableRefObject<any> = useRef(null);
  const [localStream, setLocalStream] = useState<HTMLAudioElement | null>(null);
  let peerConnection: RTCPeerConnection | null = null;
  const { account } = useAccount();
  const [publicKey, setPublicKey] = useState<SignerResult | null>(null);
  const [streamStatus, setStreamStatus] = useState<StreamState>('loading');

  const handlePlayStream = () => {
    socket.emit('watch', account?.address, {
      streamId,
      signedMsg: publicKey?.signature,
    });

    socket.on('offer', (broadcasterAddress: string, msg: IOfferMsg) => {
      peerConnection = new RTCPeerConnection(RTC_CONFIG);
      peerConnection
        ?.setRemoteDescription(msg.description)
        .then(() => peerConnection?.createAnswer())
        .then((answer: any) => peerConnection?.setLocalDescription(answer))
        .then(() => {
          socket.emit('answer', broadcasterAddress, {
            watcherId: account?.address,
            description: peerConnection?.currentLocalDescription,
          });

          setStreamStatus('success');
        });

      peerConnection!.ontrack = (event: any) => {
        setLocalStream(event.streams[0]);
      };

      peerConnection!.onicecandidate = (event: any) => {
        if (event.candidate) {
          socket.emit('candidate', broadcasterAddress, {
            candidate: event.candidate,
            id: account?.address,
          });
        }
      };
    });

    socket.on('error', ({ message }: any) => {
      if (message === `Stream with id ${streamId} hasn't started yet`) {
        setStreamStatus('not-started');
      }
      if (message === `You aren't subscribed to stream with id ${streamId}`) {
        setStreamStatus('not-subscribed');
      }
    });

    socket.on('candidate', (_: string, msg: ICandidateMsg) => {
      peerConnection?.addIceCandidate(new RTCIceCandidate(msg.candidate)).catch((e: any) => console.error(e));
    });

    socket.on('streamUpdate', (watcherId: string, msg: IStreamUpdateMsg) => {
      remoteVideo.current.srcObject = msg.stream;
    });
  };

  useEffect(() => {
    if (remoteVideo.current && localStream) {
      remoteVideo.current.srcObject = localStream;
      remoteVideo.current.play();
    }
  }, [localStream]);

  useEffect(() => {
    if (account?.address && !publicKey) {
      const { address } = account;
      web3FromAddress(address)
        .then(({ signer }) => {
          if (!signer.signRaw) {
            throw new Error('signRaw does not exist');
          }

          return signer.signRaw({ address, data: stringToHex(address), type: 'bytes' });
        })
        .then((res) => setPublicKey(res));
    }
  }, [account, account?.address, publicKey]);

  const handlePlayerReady = (player: HTMLVideoElement) => {
    remoteVideo.current = player;
  };

  return (
    <div className={cx(styles.layout)}>
      <Player onReady={handlePlayerReady} mode="watch" />

      <div className={cx(styles['broadcast-not-available'])}>
        <Button variant="primary" label="Play Stream" onClick={handlePlayStream} />
      </div>

      {streamStatus === 'not-subscribed' && (
        <div className={cx(styles['broadcast-not-available'])}>
          <h3>Broadcast not available</h3>
          <span>In order to watch the broadcast, you need to subscribe to this streamer</span>
        </div>
      )}
      {streamStatus === 'not-started' && (
        <div className={cx(styles['broadcast-not-available'])}>
          <h3>Stream in not started yet</h3>
        </div>
      )}
    </div>
  );
}

export { Watch };
