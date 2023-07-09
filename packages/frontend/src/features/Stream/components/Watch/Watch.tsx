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

interface IOfferMsg {
  userId: string;
  description: RTCSessionDescription;
  streamId: string;
}

interface ICandidateMsg {
  id: string;
  candidate: RTCIceCandidate;
}

function Watch({ socket, streamId }: any) {
  const remoteVideo: MutableRefObject<any> = useRef(null);
  const [localStream, setLocalStream] = useState<HTMLAudioElement | null>(null);
  let peerConnection: RTCPeerConnection | null = null;
  const { account } = useAccount();
  const [publicKey, setPublicKey] = useState<SignerResult | null>(null);
  const [streamStatus, setStreamStatus] = useState<StreamState>('loading');

  const onStart = () => {
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
  };

  useEffect(() => {
    if (remoteVideo.current && localStream) {
      remoteVideo.current.srcObject = localStream;
      remoteVideo.current.play();
    }
  }, [localStream]);

  useEffect(() => () => socket.emit('disconnect'), [socket]);

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

  return (
    <div className={cx(styles.layout)}>
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
      <button onClick={onStart}>Start</button>
      <video
        className={cx(styles.player)}
        controls
        preload="auto"
        // poster="//vjs.zencdn.net/v/oceans.png"
        ref={remoteVideo}
        id="video">
        <track kind="captions" src="captions.vtt" label="English" />
      </video>
    </div>
  );
}

export { Watch };
