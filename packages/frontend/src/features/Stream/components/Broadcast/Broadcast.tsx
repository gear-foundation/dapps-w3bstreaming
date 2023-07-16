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

  const micTransceiver: MutableRefObject<RTCRtpTransceiver | null> = useRef(null);
  const camTransceiver: MutableRefObject<RTCRtpTransceiver | null> = useRef(null);
  const scrCaptureTransceiver: MutableRefObject<RTCRtpTransceiver | null> = useRef(null);
  const scrAudioTransceiver: MutableRefObject<RTCRtpTransceiver | null> = useRef(null);

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

        if (!screenStream.getTracks().length) {
          setStreamType('camera');
          return;
        }

        const sequence = mediaTrackSequence.current;

        //replaces camera remote track to null
        const indexOfCameraTrack = sequence.getIndex('camera');
        if (indexOfCameraTrack !== undefined) {
          if (camTransceiver.current?.sender.track) {
            camTransceiver.current.stop();
            commonStream.current.getTracks()[indexOfCameraTrack].enabled = false;
          }
        }

        //adds or replaces screenSound remote tracks to value
        const requestedScreenAudioTrack = screenStream.getAudioTracks()?.[0];
        const indexOfExistingScreenAudioTrack = sequence.getIndex('screenSound');

        if (indexOfExistingScreenAudioTrack === undefined && requestedScreenAudioTrack && peerConnection.current) {
          sequence.add('screenSound');
          commonStream.current.addTrack(requestedScreenAudioTrack);
          // peerConnection.current!.addTrack(requestedScreenAudioTrack, currentCommonStream);
          scrAudioTransceiver.current = peerConnection.current?.addTransceiver(requestedScreenAudioTrack, {
            direction: 'sendonly',
            streams: [commonStream.current],
          });
        }

        //adds or replaces screenCapture remote tracks to value
        const requestedScreenCaptureTrack = screenStream.getVideoTracks()?.[0];
        const indexOfExistingScreenCaptureTrack = sequence.getIndex('screenCapture');

        if (indexOfExistingScreenCaptureTrack === undefined && requestedScreenCaptureTrack && peerConnection.current) {
          sequence.add('screenCapture');
          commonStream.current.addTrack(requestedScreenCaptureTrack);
          scrCaptureTransceiver.current = peerConnection.current?.addTransceiver(requestedScreenCaptureTrack, {
            direction: 'sendonly',
            streams: [commonStream.current],
          });
        }

        //creates new local stream
        const indexes = sequence.getIndexes(['microphone', 'screenSound', 'screenCapture']);

        setLocalStream(
          () => new MediaStream(indexes.map((index) => commonStream.current.getTracks()[index as number])),
        );

        screenStream.getTracks()[0].onended = () => {
          //replacing screenSound and screenCapture remote tracks to null

          const audInd = sequence.getIndex('screenSound');
          if (audInd) {
            scrAudioTransceiver.current?.stop();
            commonStream.current.removeTrack(commonStream.current.getTracks()[audInd]);
            sequence.removeByType('screenSound');
            scrCaptureTransceiver.current = null;
          }

          const capInd = sequence.getIndex('screenCapture');
          if (capInd) {
            scrCaptureTransceiver.current?.stop();
            commonStream.current.removeTrack(commonStream.current.getTracks()[capInd]);
            sequence.removeByType('screenCapture');
            scrCaptureTransceiver.current = null;
          }

          //replacing camera remote track to value
          if (indexOfCameraTrack) {
            if (camTransceiver.current?.sender.track && peerConnection.current) {
              commonStream.current.getTracks()[indexOfCameraTrack].enabled = true;
              camTransceiver.current = peerConnection.current.addTransceiver(
                commonStream.current.getTracks()[indexOfCameraTrack].clone(),
                {
                  direction: 'sendonly',
                  streams: [commonStream.current],
                },
              );
            }
          }

          const newRequiredIndexes = sequence.getIndexes(['microphone', 'camera']);
          setLocalStream(
            () => new MediaStream(newRequiredIndexes.map((index) => commonStream.current.getTracks()[index as number])),
          );
          setStreamType('camera');
        };
      } catch (err) {
        setStreamType('camera');
        console.log(err);
      }
    }
  };

  const handleMuteSound = (isMuted: boolean) => {
    const sequence = mediaTrackSequence.current;
    const indexOfMicrophone = sequence.getIndex('microphone');

    if (isMuted) {
      if (indexOfMicrophone !== undefined) {
        if (micTransceiver.current?.sender.track) {
          micTransceiver.current.sender.track.enabled = true;
          commonStream.current.getTracks()[indexOfMicrophone].enabled = true;
          setIsSoundMuted(() => false);
        }
      }
    }
    if (!isMuted) {
      if (indexOfMicrophone !== undefined) {
        if (micTransceiver.current?.sender.track) {
          micTransceiver.current.sender.track.enabled = false;
          commonStream.current.getTracks()[indexOfMicrophone].enabled = false;
          setIsSoundMuted(() => true);
        }
      }
    }
  };

  const handleBlockCamera = (isBlocked: boolean) => {
    if (streamType === 'camera') {
      const sequence = mediaTrackSequence.current;
      const indexOfCamera = sequence.getIndex('camera');

      if (isBlocked) {
        if (indexOfCamera !== undefined) {
          if (camTransceiver.current?.sender.track) {
            camTransceiver.current.sender.track.enabled = true;
            commonStream.current.getTracks()[indexOfCamera].enabled = true;
          }
        }
      }

      if (!isBlocked) {
        if (indexOfCamera !== undefined) {
          if (camTransceiver.current?.sender.track) {
            camTransceiver.current.sender.track.enabled = false;
            commonStream.current.getTracks()[indexOfCamera].enabled = false;
          }
        }
      }
    }

    setIsCameraBlocked((prev) => !prev);
  };

  const startStream = async () => {
    if (!account?.decodedAddress) {
      return;
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const requestedStream = await navigator.mediaDevices.getUserMedia({
        video: devices.some((device) => device.kind === 'videoinput'),
        audio: devices.some((device) => device.kind === 'audioinput'),
      });
      const sequence = mediaTrackSequence.current;

      const micTrack = requestedStream.getAudioTracks()?.[0];

      if (micTrack) {
        commonStream.current.addTrack(micTrack);
        sequence.add('microphone');
      } else {
        setIsSoundMuted(true);
      }

      const camTrack = requestedStream.getVideoTracks()?.[0];

      if (camTrack) {
        commonStream.current.addTrack(camTrack);
        sequence.add('camera');
      } else {
        setIsCameraBlocked(true);
      }

      setLocalStream(requestedStream);

      socket.emit('broadcast', account?.decodedAddress, { streamId });

      socket.on('watch', (idOfWatcher: string, msg: WatchMsg) => {
        peerConnection.current = new RTCPeerConnection(RTC_CONFIG);
        conns.current[idOfWatcher] = peerConnection.current as RTCPeerConnection;

        if (micTrack) {
          micTransceiver.current = peerConnection.current?.addTransceiver(micTrack, {
            direction: 'sendonly',
            streams: [commonStream.current],
          });
        }

        if (camTrack) {
          camTransceiver.current = peerConnection.current?.addTransceiver(camTrack, {
            direction: 'sendonly',
            streams: [commonStream.current],
          });
        }

        peerConnection.current!.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
          if (event.candidate) {
            socket.emit('candidate', idOfWatcher, { id: account.address, candidate: event.candidate });
          }
        };

        peerConnection
          .current!.createOffer()
          .then((offer) => peerConnection.current?.setLocalDescription(offer))
          .then(() =>
            socket.emit('offer', account?.decodedAddress, {
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
              socket.emit('updateOffers', account?.decodedAddress, {
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
    socket.emit('stopBroadcasting', account?.decodedAddress, {
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
