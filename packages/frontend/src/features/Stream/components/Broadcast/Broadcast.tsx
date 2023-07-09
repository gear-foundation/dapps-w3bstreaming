import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useAccount } from '@gear-js/react-hooks';
import styles from './Broadcast.module.scss';
import { cx } from '@/utils';
import { RTC_CONFIG } from '../../config';
import { Player } from '../Player';

interface IWatchMsg {
  streamId: string;
  signedMsg: string;
}

interface IAnswerMsg {
  watcherId: string;
  description: RTCSessionDescription;
}

interface ICandidateMsg {
  id: string;
  candidate: RTCIceCandidate;
}
function Broadcast({ socket, streamId }: any) {
  const [localStream, setLocalStream] = useState<any>(null);
  const localVideo: MutableRefObject<any> = useRef(null);
  let peerConnection: RTCPeerConnection | null = null;
  const conns: any = {};

  const { account } = useAccount();

  function startStream() {
    if (!streamId || !account?.address) {
      alert('Set stream id');
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((s) => {
        setLocalStream(s);
        return s;
      })
      .then((s) => {
        socket.emit('broadcast', account?.address, { streamId });

        socket.on('watch', (idOfWatcher: string, msg: IWatchMsg) => {
          peerConnection = new RTCPeerConnection(RTC_CONFIG);
          conns[idOfWatcher] = peerConnection;
          s.getTracks().forEach((t: any) => peerConnection?.addTrack(t, s));
          peerConnection.onicecandidate = (event: any) => {
            if (event.candidate) {
              socket.emit('candidate', idOfWatcher, { id: account.address, candidate: event.candidate });
            }
          };

          peerConnection
            .createOffer()
            .then((offer) => peerConnection?.setLocalDescription(offer))
            .then(() =>
              socket.emit('offer', account?.address, {
                description: peerConnection?.localDescription,
                userId: idOfWatcher,
                streamId: msg.streamId,
              }),
            );
        });
      });

    socket.on('candidate', (idOfWatcher: string, msg: ICandidateMsg) => {
      conns[idOfWatcher]?.addIceCandidate(new RTCIceCandidate(msg.candidate)).catch((e: any) => console.error(e));
    });

    socket.on('answer', (_: string, msg: IAnswerMsg) => {
      conns[msg.watcherId]?.setRemoteDescription(msg.description);
    });
  }

  useEffect(() => {
    if (localVideo.current && localStream) {
      localVideo.current.srcObject = localStream;
      localVideo.current.play();
    }
  }, [localStream]);

  useEffect(() => () => socket.emit('disconnect'), [socket]);

  return (
    <div className={cx(styles.layout)}>
      <button onClick={startStream}>Start stream</button>
      <div className={cx(styles['player-container'])}>
        {/* <Player ref={localVideo} onReady={handlePlayerReady} /> */}
        <video
          className={cx(styles.player)}
          controls
          preload="auto"
          // poster="//vjs.zencdn.net/v/oceans.png"
          ref={localVideo}
          id="audio"
          autoPlay>
          <track kind="captions" src="captions.vtt" label="English" />
        </video>
      </div>
    </div>
  );
}

export { Broadcast };
