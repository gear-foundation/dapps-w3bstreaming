import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAccount } from '@gear-js/react-hooks';
import styles from './Broadcast.module.scss';
import { cx } from '@/utils';
import { RTC_CONFIG } from '../../config';
import { Player } from '../Player';
import { Button } from '@/ui';

import StreamSignalSVG from '@/assets/icons/signal-stream-icon.svg';
import { MediaStreamSequence } from '../../utils';
import { BroadcastProps, AnswerMsg, CandidateMsg, WatchMsg, StreamStatus, StreamType } from './Broadcast.interface';

function Broadcast({ socket, streamId }: BroadcastProps) {
  const { account } = useAccount();
  const navigate = useNavigate();

  const localVideo: MutableRefObject<HTMLVideoElement | null> = useRef(null);
  const peerConnection: MutableRefObject<RTCPeerConnection | null> = useRef(null);
  const conns: MutableRefObject<Record<string, RTCPeerConnection>> = useRef({});
  const commonStream: MutableRefObject<MediaStream> = useRef(new MediaStream());
  const mediaTrackSequence: MutableRefObject<MediaStreamSequence> = useRef(new MediaStreamSequence());

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);
  const [isCameraBlocked, setIsCameraBlocked] = useState<boolean>(false);
  const [streamStatus, setStreamStatus] = useState<StreamStatus>('not-started');
  const [streamType, setStreamType] = useState<StreamType>('camera');

  const handleGoToAccountPage = () => {
    navigate('/account');
  };

  const handleScreenShare = async () => {
    if (streamType === 'screen') {
      return;
    }
    if (streamType === 'camera') {
      try {
        setStreamType('screen');

        const screenStream = await navigator.mediaDevices.getDisplayMedia({ audio: true, video: true });
        const currentCommonStream = commonStream.current;
        const sequence = mediaTrackSequence.current;

        //replaces camera remote track to null
        const indexOfCameraTrack = sequence.getIndex('camera');
        if (indexOfCameraTrack !== undefined) {
          peerConnection.current!.getSenders()[indexOfCameraTrack].replaceTrack(null);
        }

        //adds or replaces screenSound remote tracks to value
        const requestedScreenAudioTrack = screenStream.getAudioTracks()?.[0];
        const indexOfExistingScreenAudioTrack = sequence.getIndex('screenSound');

        if (indexOfExistingScreenAudioTrack !== undefined && requestedScreenAudioTrack) {
          peerConnection.current!.getSenders()[indexOfExistingScreenAudioTrack].replaceTrack(requestedScreenAudioTrack);
        }

        if (indexOfExistingScreenAudioTrack === undefined && requestedScreenAudioTrack) {
          sequence.add('screenSound');
          currentCommonStream.addTrack(requestedScreenAudioTrack);
          peerConnection.current!.addTrack(requestedScreenAudioTrack, currentCommonStream);
        }

        //adds or replaces screenCapture remote tracks to value
        const requestedScreenCaptureTrack = screenStream.getVideoTracks()?.[0];
        const indexOfExistingScreenCaptureTrack = sequence.getIndex('screenCapture');

        if (indexOfExistingScreenCaptureTrack !== undefined && requestedScreenCaptureTrack) {
          peerConnection
            .current!.getSenders()
            [indexOfExistingScreenCaptureTrack].replaceTrack(requestedScreenCaptureTrack);
        }

        if (indexOfExistingScreenCaptureTrack === undefined && requestedScreenCaptureTrack) {
          sequence.add('screenCapture');
          currentCommonStream.addTrack(requestedScreenCaptureTrack);
          peerConnection.current!.addTrack(requestedScreenCaptureTrack, currentCommonStream);
        }

        //creates new local stream
        const commonStreamTracks = currentCommonStream.getTracks();

        const microphoneIndex = sequence.getIndex('microphone');

        if (microphoneIndex !== undefined) {
          setLocalStream(
            () =>
              new MediaStream([
                commonStreamTracks[microphoneIndex],
                requestedScreenAudioTrack,
                requestedScreenCaptureTrack,
              ]),
          );
        } else {
          setLocalStream(() => new MediaStream([requestedScreenAudioTrack, requestedScreenCaptureTrack]));
        }

        requestedScreenAudioTrack.onended = () => {
          //replacing screenSound and screenCapture remote tracks to null
          const replaceIndexes = sequence.getIndexes(['screenSound', 'screenCapture']);
          peerConnection.current?.getSenders().forEach((sender, senderTrackIndex) => {
            if (replaceIndexes.includes(senderTrackIndex)) {
              sender.replaceTrack(null);
            }
          });

          //replacing camera remote track to value
          if (indexOfCameraTrack) {
            peerConnection
              .current!.getSenders()
              [indexOfCameraTrack].replaceTrack(commonStreamTracks[indexOfCameraTrack]);
          }

          const newRequiredIndexes = sequence.getIndexes(['microphone', 'camera']);
          setLocalStream(() => new MediaStream(newRequiredIndexes.map((index) => commonStreamTracks[index])));
          setStreamType('camera');
        };
      } catch (err) {
        setStreamType('camera');
        console.log(err);
      }
    }
  };

  const handleMuteSound = (isMuted: boolean) => {
    const currentCommonStream = commonStream.current;
    const commonStreamTracks = currentCommonStream.getTracks();
    const sequence = mediaTrackSequence.current;
    const indexOfMicrophone = sequence.getIndex('microphone');

    if (isMuted) {
      if (indexOfMicrophone !== undefined) {
        peerConnection.current!.getSenders()[indexOfMicrophone].replaceTrack(commonStreamTracks[indexOfMicrophone]);
        //TODO mute yourself
        setIsSoundMuted(false);
      }
    }
    if (!isMuted) {
      if (indexOfMicrophone !== undefined) {
        peerConnection.current!.getSenders()[indexOfMicrophone].replaceTrack(null);
        //TODO mute yourself
        setIsSoundMuted(true);
      }
    }
  };

  const handleBlockCamera = (isBlocked: boolean) => {
    if (streamType === 'camera') {
      const sequence = mediaTrackSequence.current;
      const indexOfCamera = sequence.getIndex('camera');
      const commonStreamTracks = commonStream.current.getTracks();

      if (!isBlocked && indexOfCamera !== undefined) {
        peerConnection.current!.getSenders()[indexOfCamera].replaceTrack(null);
        //TODO block yourself
        setIsSoundMuted(true);
        setIsCameraBlocked(isBlocked);
      }

      if (isBlocked && indexOfCamera !== undefined) {
        peerConnection.current!.getSenders()[indexOfCamera].replaceTrack(commonStreamTracks[indexOfCamera]);
        //TODO block yourself
        setIsCameraBlocked(!isBlocked);
      }
    }
  };

  const startStream = async () => {
    if (!account?.address) {
      return;
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const requestedStream = await navigator.mediaDevices.getUserMedia({
        video: devices.some((device) => device.kind === 'videoinput'),
        audio: devices.some((device) => device.kind === 'audioinput'),
      });

      const stream = commonStream.current;
      const sequence = mediaTrackSequence.current;

      const micTrack = requestedStream.getAudioTracks()?.[0];
      if (micTrack) {
        stream.addTrack(micTrack);
        sequence.add('microphone');
      } else {
        setIsSoundMuted(true);
      }

      const camTrack = requestedStream.getVideoTracks()?.[0];
      if (camTrack) {
        stream.addTrack(camTrack);
        sequence.add('camera');
      } else {
        setIsCameraBlocked(true);
      }

      setLocalStream(requestedStream);

      socket.emit('broadcast', account?.address, { streamId });

      socket.on('watch', (idOfWatcher: string, msg: WatchMsg) => {
        peerConnection.current = new RTCPeerConnection(RTC_CONFIG);
        conns.current[idOfWatcher] = peerConnection.current;
        requestedStream.getTracks().forEach((t) => peerConnection.current?.addTrack(t, stream));

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
              mediaSequence: mediaTrackSequence.current,
            }),
          );
      });

      socket.on('candidate', (idOfWatcher: string, msg: CandidateMsg) => {
        conns.current[idOfWatcher]
          ?.addIceCandidate(new RTCIceCandidate(msg.candidate))
          .catch((e: any) => console.error(e));
      });

      socket.on('answer', (_: string, msg: AnswerMsg) => {
        conns.current[msg.watcherId]?.setRemoteDescription(msg.description);

        peerConnection.current!.onnegotiationneeded = () => {
          peerConnection
            .current!.createOffer()
            .then((offer) => peerConnection.current!.setLocalDescription(offer))
            .then(() =>
              socket.emit('updateOffers', account?.address, {
                description: peerConnection.current?.localDescription,
                streamId,
              }),
            );
        };
      });
    } catch (error) {
      if (
        (error as Error).message ===
        `Failed to execute 'getUserMedia' on 'MediaDevices': At least one of audio and video must be requested`
      ) {
        alert('At least one of audio and video must be');
      }
    }
  };

  const handleStopStream = () => {
    localStream?.getTracks().forEach((track) => track.stop());
    peerConnection.current?.getSenders().forEach((sender) => {
      peerConnection.current?.removeTrack(sender);
    });
    peerConnection.current?.close();
    socket.emit('stopBroadcasting', account?.address, {
      streamId,
    });
    setStreamStatus('ended');
  };

  useEffect(() => {
    if (localVideo.current && localStream) {
      setStreamStatus('streaming');
      localVideo.current.srcObject = localStream;

      localVideo.current
        .play()
        .then((s) => s)
        .catch((err) => console.log(err));
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
        isCameraBlocked={Boolean(streamType === 'camera' && isCameraBlocked)}
        onCameraBlock={handleBlockCamera}
        onStopStream={handleStopStream}
        isSharingScreen={streamType === 'screen'}
        onShareScreen={handleScreenShare}
      />
      {streamStatus === 'not-started' && (
        <div className={cx(styles['start-stream-curtain'])}>
          <Button variant="primary" label="Start Stream" icon={StreamSignalSVG} onClick={startStream} />
        </div>
      )}
      {streamStatus === 'ended' && (
        <div className={cx(styles['start-stream-curtain'])}>
          <h3>You&apos;ve ended the stream</h3>
          <Button variant="primary" label="Repeat" icon={StreamSignalSVG} onClick={startStream} />
          <Button variant="outline" label="Close" onClick={handleGoToAccountPage} />
        </div>
      )}
    </div>
  );
}

export { Broadcast };
