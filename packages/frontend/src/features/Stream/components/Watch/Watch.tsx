import { MutableRefObject, useEffect, useRef, useState, useCallback } from 'react';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { SignerResult } from '@polkadot/api/types';
import { stringToHex } from '@polkadot/util';
import { useAccount } from '@gear-js/react-hooks';
import styles from './Watch.module.scss';
import { cx } from '@/utils';
import { CandidateMsg, ErrorMsg, OfferMsg, StreamState, WatchProps } from './Watch.interface';
import { Player } from '../Player';
import { Loader } from '@/components';
import { RTC_CONFIG } from '../../config';
import { Button } from '@/ui';
import { MediaStreamSequence } from '../../utils';

function Watch({ socket, streamId }: WatchProps) {
  const remoteVideo: MutableRefObject<HTMLVideoElement | null> = useRef(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const peerConnection: MutableRefObject<RTCPeerConnection | null> = useRef(null);
  const { account } = useAccount();
  const [publicKey, setPublicKey] = useState<SignerResult | null>(null);
  const [streamStatus, setStreamStatus] = useState<StreamState>('ready-to-play');
  const mediaTrackSequence: MutableRefObject<MediaStreamSequence | null> = useRef(null);
  const retryIntervalId: MutableRefObject<ReturnType<typeof setInterval> | null> = useRef(null);

  const handlePlayStream = useCallback(() => {
    if (!account?.address || !publicKey?.signature || !streamId) {
      return;
    }

    setStreamStatus('loading');
    socket.emit('watch', account?.address, {
      streamId,
      signedMsg: publicKey?.signature,
    });

    peerConnection.current = new RTCPeerConnection(RTC_CONFIG);

    socket.on('offer', (broadcasterAddress: string, msg: OfferMsg) => {
      mediaTrackSequence.current = msg.mediaSequence;
      peerConnection.current
        ?.setRemoteDescription(msg.description)
        .then(() => peerConnection.current?.createAnswer())
        .then((answer: any) => peerConnection.current?.setLocalDescription(answer))
        .then(() => {
          socket.emit('answer', broadcasterAddress, {
            watcherId: account?.address,
            description: peerConnection.current?.localDescription,
          });
          setLocalStream(null);
        });

      peerConnection.current!.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
        if (event.candidate) {
          socket.emit('candidate', broadcasterAddress, {
            candidate: event.candidate,
            id: account?.address,
          });
        }
      };

      peerConnection.current!.ontrack = (event: RTCTrackEvent) => {
        if (event.streams[0]) {
          setLocalStream(() => event.streams[0]);
        } else {
          setLocalStream((prev) => new MediaStream([...(prev ? prev!.getTracks() : []), event.track]));
        }
      };

      peerConnection.current!.onnegotiationneeded = () => {
        peerConnection.current!.setRemoteDescription(msg.description);
        peerConnection
          .current!.createAnswer()
          .then((answer) => {
            peerConnection.current!.setLocalDescription(answer);
          })
          .then(() => {
            socket.emit('answer', broadcasterAddress, {
              watcherId: account?.address,
              description: peerConnection.current?.localDescription,
            });
          });
      };
    });

    socket.on('error', ({ message }: ErrorMsg) => {
      if (message === `Stream with id ${streamId} hasn't started yet`) {
        setStreamStatus('not-started');
      }
      if (message === `You aren't subscribed to stream with id ${streamId}`) {
        setStreamStatus('not-subscribed');
      }
    });

    socket.on('candidate', (_: string, msg: CandidateMsg) => {
      peerConnection.current?.addIceCandidate(new RTCIceCandidate(msg.candidate)).catch((err) => console.error(err));
    });
  }, [account?.address, publicKey?.signature, socket, streamId]);

  useEffect(() => {
    if (remoteVideo.current && localStream) {
      setStreamStatus('streaming');
      remoteVideo.current.srcObject = localStream;
      remoteVideo.current
        .play()
        .then((s) => s)
        .catch((err) => console.log(err));
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

  useEffect(() => {
    if (streamStatus === 'not-started') {
      if (account?.address && publicKey?.signature && !retryIntervalId.current) {
        retryIntervalId.current = setInterval(() => {
          socket.emit('watch', account?.address, {
            streamId,
            signedMsg: publicKey?.signature,
          });
        }, 2000);
      }
    }

    if (streamStatus !== 'not-started') {
      if (retryIntervalId.current) {
        clearInterval(retryIntervalId.current);
      }
    }
  }, [streamStatus, account?.address, publicKey?.signature, streamId, socket]);

  const handlePlayerReady = (player: HTMLVideoElement) => {
    remoteVideo.current = player;
  };

  return (
    <div className={cx(styles.layout)}>
      <Player onReady={handlePlayerReady} mode="watch" />
      {streamStatus === 'loading' && (
        <div className={cx(styles['broadcast-not-available'])}>
          <Loader />
        </div>
      )}
      {streamStatus === 'ready-to-play' && (
        <div className={cx(styles['broadcast-not-available'])}>
          <Button variant="primary" label="Play Stream" onClick={handlePlayStream} />
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
