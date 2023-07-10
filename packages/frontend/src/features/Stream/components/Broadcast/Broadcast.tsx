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

interface ISharingMsg {
  watcherId: string;
}

function Broadcast({ socket, streamId }: any) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localVideo: MutableRefObject<HTMLVideoElement | null> = useRef(null);
  const peerConnection: MutableRefObject<RTCPeerConnection | null> = useRef(null);
  const conns: MutableRefObject<Record<string, RTCPeerConnection>> = useRef({});

  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const [isSharingScreen, setIsSharingScreen] = useState<boolean>(false);

  const { account } = useAccount();
  console.log(account?.address);
  const handleScreenShare = () => {
    const currentVoiceTracks = localStream?.getAudioTracks();
    currentVoiceTracks?.forEach((t) => t.stop());

    navigator.mediaDevices
      .getDisplayMedia({ audio: true, video: true })
      .then((s) => {
        setLocalStream(s);
        return s;
      })
      .then((s) => {
        socket.on('sharing', (broadcasterId: string, msg: ISharingMsg) => {
          const videoTracks = s.getVideoTracks();
          const audioTracks = s.getAudioTracks();
          console.log(videoTracks[0]);
          // peerConnection.current?.getTransceivers().forEach((transceiver) => {
          //   transceiver.sender.replaceTrack(audioTracks[0]);
          // });
          peerConnection.current!.addTrack(videoTracks[0]);

          peerConnection.current!.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
            if (event.candidate) {
              socket.emit('candidate', msg.watcherId, { id: broadcasterId, candidate: event.candidate });
            }
          };

          peerConnection.current!.onnegotiationneeded = (ev: Event) => {
            console.log('FFFFFFFFF');
            console.log(ev);

            peerConnection
              .current!.createOffer()
              .then((offer) => peerConnection.current!.setLocalDescription(offer))
              .then(() =>
                socket.emit('offer', account?.address, {
                  description: peerConnection.current?.localDescription,
                  userId: msg.watcherId,
                  streamId,
                }),
              );
          };
        });

        socket.emit('streamUpdate', account?.address, {
          type: 'sharing',
        });
      });
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

  // const handleShareCamera = (isPlaying: boolean) => {
  //   if (localStream) {
  //     if (!isPlaying) {
  //       navigator.mediaDevices
  //         .enumerateDevices()
  //         .then((devices) => ({
  //           video: devices.some((device) => device.kind === 'videoinput'),
  //           audio: devices.some((device) => device.kind === 'audioinput'),
  //         }))
  //         .then((constrains) =>
  //           navigator.mediaDevices
  //             .getUserMedia(constrains)
  //             .then((s) => {
  //               setLocalStream(s);
  //               return s;
  //             })
  //             .then((s) => {
  //               peerConnection.current = new RTCPeerConnection(RTC_CONFIG);

  //               Object.keys(conns).forEach((connection) => {
  //                 conns.current[connection] = peerConnection.current as RTCPeerConnection;

  //                 s.getTracks().forEach((t) => peerConnection.current?.addTrack(t, s));

  //                 conns.current[connection].onicecandidate = (event: RTCPeerConnectionIceEvent) => {
  //                   if (event.candidate) {
  //                     socket.emit('candidate', connection, { id: account?.address, candidate: event.candidate });
  //                   }
  //                 };

  //                 conns.current[connection]
  //                   .createOffer()
  //                   .then((offer) => peerConnection.current?.setLocalDescription(offer))
  //                   .then(() =>
  //                     socket.emit('offer', account?.address, {
  //                       description: peerConnection.current?.localDescription,
  //                       userId: connection,
  //                       streamId,
  //                     }),
  //                   );
  //               });
  //             }),
  //         );
  //     }
  //   }
  // };

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
              peerConnection.current = new RTCPeerConnection(RTC_CONFIG);
              conns.current[idOfWatcher] = peerConnection.current;
              s.getTracks().forEach((t) => peerConnection.current?.addTrack(t, s));

              peerConnection.current.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
                if (event.candidate) {
                  socket.emit('candidate', idOfWatcher, { id: account.address, candidate: event.candidate });
                }
              };

              peerConnection.current
                .createOffer()
                .then((offer) => peerConnection.current?.setLocalDescription(offer))
                .then(() =>
                  socket.emit('offer', account?.address, {
                    description: peerConnection.current?.localDescription,
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
      conns.current[idOfWatcher]
        ?.addIceCandidate(new RTCIceCandidate(msg.candidate))
        .catch((e: any) => console.error(e));
    });

    socket.on('answer', (_: string, msg: IAnswerMsg) => {
      console.log('ANSWER');
      console.log(msg.description);
      conns.current[msg.watcherId]?.setRemoteDescription(msg.description);
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
        // onVideoPlaying={handleShareCamera}
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
