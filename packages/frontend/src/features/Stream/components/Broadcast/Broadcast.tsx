import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useAccount } from '@gear-js/react-hooks';
import styles from './Broadcast.module.scss';
import { cx } from '@/utils';
import { RTC_CONFIG } from '../../config';
import { Player } from '../Player';
import { Button } from '@/ui';

import StreamSignalSVG from '@/assets/icons/signal-stream-icon.svg';

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
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localVideo: MutableRefObject<HTMLVideoElement | null> = useRef(null);
  let peerConnection: RTCPeerConnection | null = null;
  const conns: Record<string, RTCPeerConnection> = {};

  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const [isSharingScreen, setIsSharingScreen] = useState<boolean>(false);

  const { account } = useAccount();

  const handleScreenShare = (isSharing: boolean) => {
    if (isSharing) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => ({
          video: devices.some((device) => device.kind === 'videoinput'),
          audio: devices.some((device) => device.kind === 'audioinput'),
        }))
        .then((constrains) =>
          navigator.mediaDevices.getUserMedia(constrains).then((s) => {
            setLocalStream(s);
          }),
        );
      setIsSharingScreen(false);
    } else {
      navigator.mediaDevices
        .getDisplayMedia({
          video: true,
          audio: true,
        })
        .then((screenStream) => {
          if (localStream) {
            const combinedStream = new MediaStream([
              ...screenStream.getVideoTracks(),
              ...localStream!.getAudioTracks(),
            ]);

            socket.emit('streamUpdate', account?.address, {
              type: 'sharing',
              stream: combinedStream,
            });

            setLocalStream(combinedStream);
          } else {
            socket.emit('streamUpdate', account?.address, {
              type: 'sharing',
              stream: screenStream,
            });

            setLocalStream(screenStream);
          }

          setIsSharingScreen(true);
        });
    }
  };

  const handleMuteSound = (isMuted: boolean) => {
    if (localStream) {
      if (isMuted) {
        localStream.getAudioTracks().forEach((track) => {
          // eslint-disable-next-line no-param-reassign
          track.enabled = true;
        });
        setIsSoundMuted(false);
      } else {
        localStream.getAudioTracks().forEach((track) => {
          // eslint-disable-next-line no-param-reassign
          track.enabled = false;
        });
        setIsSoundMuted(true);
      }

      socket.emit('streamUpdate', account?.address, {
        type: 'muted',
        tracks: localStream.getTracks(),
      });
    }
  };

  const handlePlayVideo = (isPlaying: boolean) => {
    if (localStream) {
      if (isPlaying) {
        localStream.getVideoTracks().forEach((track) => ({
          ...track,
          enabled: true,
        }));
        setIsVideoPlaying(false);
      } else {
        localStream.getVideoTracks().forEach((track) => ({
          ...track,
          enabled: false,
        }));
        setIsVideoPlaying(true);
      }

      socket.emit('streamUpdate', account?.address, {
        type: 'playing',
        stream: localStream,
      });
    }
  };

  useEffect(() => {
    if (localStream) {
      if (!localStream.getVideoTracks().length) {
        setIsVideoPlaying(false);
      }
    }
  }, [localStream]);

  useEffect(() => {
    if (localStream) {
      if (!localStream.getAudioTracks().length) {
        setIsSoundMuted(true);
      }
    }
  }, [localStream]);

  const startStream = () => {
    if (!streamId || !account?.address) {
      alert('Set stream id');
      return;
    }
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => ({
        video: devices.some((device) => device.kind === 'videoinput'),
        audio: devices.some((device) => device.kind === 'audioinput'),
      }))
      .then((constrains) =>
        navigator.mediaDevices
          .getUserMedia(constrains)
          .then((s) => {
            setLocalStream(s);
            return s;
          })
          .then((s) => {
            socket.emit('broadcast', account?.address, { streamId });

            socket.on('watch', (idOfWatcher: string, msg: IWatchMsg) => {
              peerConnection = new RTCPeerConnection(RTC_CONFIG);
              conns[idOfWatcher] = peerConnection;
              s.getTracks().forEach((t) => peerConnection?.addTrack(t, s));
              peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
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
          }),
      )
      .catch((error) => {
        if (
          error.message ===
          `Failed to execute 'getUserMedia' on 'MediaDevices': At least one of audio and video must be requested`
        ) {
          alert('At least one of audio and video must be');
        }
      });

    socket.on('candidate', (idOfWatcher: string, msg: ICandidateMsg) => {
      conns[idOfWatcher]?.addIceCandidate(new RTCIceCandidate(msg.candidate)).catch((e: any) => console.error(e));
    });

    socket.on('answer', (_: string, msg: IAnswerMsg) => {
      conns[msg.watcherId]?.setRemoteDescription(msg.description);
    });
  };

  const handleStopStream = () => {
    socket.emit('stopBroadcasting', account?.address, {
      streamId,
    });
    localStream?.getTracks().forEach((track) => track.stop());
  };

  useEffect(() => {
    if (localVideo.current && localStream) {
      localVideo.current.srcObject = localStream;
      localVideo.current.play();
    }
  }, [localStream]);

  const handlePlayerReady = (player: HTMLVideoElement) => {
    localVideo.current = player;
  };

  return (
    <div className={cx(styles.layout)}>
      <Player
        onReady={handlePlayerReady}
        mode="broadcast"
        isMuted={isSoundMuted}
        onSoundMute={handleMuteSound}
        isVideoPlaying={isVideoPlaying}
        onVideoPlaying={handlePlayVideo}
        onStopStream={handleStopStream}
        isSharingScreen={isSharingScreen}
        onShareScreen={handleScreenShare}
      />
      {!localStream && (
        <div className={cx(styles['start-stream-curtain'])}>
          <Button variant="primary" label="Start Stream" icon={StreamSignalSVG} onClick={startStream} />
        </div>
      )}
      {/* <div className={cx(styles['player-container'])}>
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
      </div> */}
    </div>
  );
}

export { Broadcast };
