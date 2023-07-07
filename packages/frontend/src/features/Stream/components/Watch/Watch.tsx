import { MutableRefObject, useEffect, useId, useRef, useState } from 'react';
import { useParams } from 'react-router';
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

function Watch({ socket, id, broadcasterId }: any) {
  const remoteVideo: MutableRefObject<any> = useRef(null);
  const [localStream, setLocalStream] = useState<HTMLAudioElement | null>(null);
  let peerConnection: RTCPeerConnection | null = null;
  const { account } = useAccount();
  const [publicKey, setPublicKey] = useState<SignerResult | null>(null);
  const { id: streamId } = useParams();
  const [streamStatus, setStreamStatus] = useState<StreamState>('loading');
  console.log(streamId);

  const onStart = () => {
    socket.emit('watch', account?.address, {
      streamId: id,
      signedMsg: publicKey?.signature,
    });

    socket.on('offer', (broadcasterAddress: string, msg: IOfferMsg) => {
      peerConnection = new RTCPeerConnection(RTC_CONFIG);
      peerConnection
        .setRemoteDescription(msg.description)
        .then(() => peerConnection?.createAnswer())
        .then((answer: any) => peerConnection?.setLocalDescription(answer))
        .then(() => {
          socket.emit('answer', account?.address, {
            broadcasterId: broadcasterAddress,
            description: peerConnection?.currentLocalDescription,
          });
        });

      peerConnection.ontrack = (event: any) => {
        console.log(event);
        setLocalStream(event.streams[0]);
      };

      peerConnection.onicecandidate = (event: any) => {
        console.log('WATCHER ON');
        console.log(event.candidate);
        console.log(account?.address);
        console.log(broadcasterId);
        if (event.candidate) {
          socket.emit('candidate', account?.address, {
            candidate: event.candidate,
            id: broadcasterAddress,
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
      console.log('WATCHER ADD');
      console.log(msg.candidate);
      const cand = new RTCIceCandidate(msg.candidate);

      peerConnection?.addIceCandidate(cand).catch((e: any) => console.error(e));
    });
  };

  useEffect(() => {
    if (remoteVideo.current && localStream) {
      remoteVideo.current.srcObject = localStream;
      remoteVideo.current.play();
    }
  }, [localStream]);

  useEffect(() => {
    console.log('watcch');
    return () => {
      console.log('disconnected');
      socket.emit('disconnect');
    };
  }, [socket]);

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
      {/* {streamStatus === 'not-subscribed' && (
        <div className={cx(styles['broadcast-not-available'])}>
          <h3>Broadcast not available</h3>
          <span>In order to watch the broadcast, you need to subscribe to this streamer</span>
        </div>
      )}
      {streamStatus === 'not-started' && (
        <div className={cx(styles['broadcast-not-available'])}>
          <h3>Stream in not started yet</h3>
        </div>
      )} */}
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
