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
  type: 'muted' | 'playing' | 'sharing' | 'finished';
  tracks: MediaStreamTrack[];
}

function Watch({ socket, streamId }: any) {
  const remoteVideo: MutableRefObject<HTMLVideoElement | null> = useRef(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const peerConnection: MutableRefObject<RTCPeerConnection | null> = useRef(null);
  const { account } = useAccount();
  const [publicKey, setPublicKey] = useState<SignerResult | null>(null);
  const [streamStatus, setStreamStatus] = useState<StreamState>('initialized');

  const handlePlayStream = () => {
    setStreamStatus('loading');
    socket.emit('watch', account?.address, {
      streamId,
      signedMsg: publicKey?.signature,
    });

    peerConnection.current = new RTCPeerConnection(RTC_CONFIG);

    socket.on('offer', (broadcasterAddress: string, msg: IOfferMsg) => {
      peerConnection.current
        ?.setRemoteDescription(msg.description)
        .then(() => peerConnection.current?.createAnswer())
        .then((answer: any) => peerConnection.current?.setLocalDescription(answer))
        .then(() => {
          socket.emit('answer', broadcasterAddress, {
            watcherId: account?.address,
            description: peerConnection.current?.localDescription,
          });

          setStreamStatus('success');
        });

      peerConnection.current!.onicecandidate = (event: any) => {
        if (event.candidate) {
          socket.emit('candidate', broadcasterAddress, {
            candidate: event.candidate,
            id: account?.address,
          });
        }
      };

      peerConnection.current!.ontrack = (event: RTCTrackEvent) => {
        console.log('FIRED');
        if (event.streams[0]) {
          console.log('OKI');
          setLocalStream(event.streams[0]);
        } else {
          console.log('NO');
          const newStream = new MediaStream([event.track]);

          setLocalStream(newStream);
        }
      };

      peerConnection.current!.onnegotiationneeded = () => {
        console.log('FFFFF');
        peerConnection.current!.setRemoteDescription(msg.description);
        peerConnection
          .current!.createAnswer()
          .then((answer) => {
            peerConnection.current!.setLocalDescription(answer);
          })
          .then(() => {
            socket.emit('answer', broadcasterAddress, {
              watcherId: account?.address,
              description: peerConnection.current?.currentLocalDescription,
            });
          });
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
      console.log(msg.candidate);
      peerConnection.current?.addIceCandidate(new RTCIceCandidate(msg.candidate)).catch((e: any) => console.error(e));
    });

    socket.on('streamUpdate', (broadcasterId: string, msg: IStreamUpdateMsg) => {
      if (msg.type === 'sharing') {
        socket.emit('sharing', broadcasterId, {
          watcherId: account?.address,
        });
      }
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
      {streamStatus === 'initialized' && (
        <div className={cx(styles['broadcast-not-available'])}>
          <Button variant="primary" label="Play Stream" onClick={handlePlayStream} />
        </div>
      )}
      {streamStatus === 'loading' && (
        <div className={cx(styles['broadcast-not-available'])}>
          <Loader />
        </div>
      )}
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
