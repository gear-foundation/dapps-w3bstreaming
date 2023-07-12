import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { PlayerProps } from './Player.interfaces';
import { cx } from '@/utils';
import styles from './Player.module.scss';
import { Button } from '@/ui';
import PlaySVG from '@/assets/icons/player-play-icon.svg';
import MicSVG from '@/assets/icons/player-mic-icon.svg';
import MutedMicSVG from '@/assets/icons/player-mic-muted-icon.svg';
import ShareSVG from '@/assets/icons/player-share-icon.svg';
import ShareActiveSVG from '@/assets/icons/player-share-active-icon.svg';
import CameraSVG from '@/assets/icons/player-camera-icon.svg';
import BLockedCameraSVG from '@/assets/icons/player-camera-blocked-icon.svg';
import LeaveSVG from '@/assets/icons/player-leave-icon.svg';
import FullScreenSVG from '@/assets/icons/player-fullscreen-icon.svg';
import VolumeSVG from '@/assets/icons/player-volume-icon.svg';

function Player({
  mode,
  onReady,
  isMuted = false,
  onSoundMute,
  isCameraBlocked = false,
  onCameraBlock,
  onStopStream,
  isSharingScreen = false,
  onShareScreen,
}: PlayerProps) {
  const playerRef: MutableRefObject<HTMLVideoElement | null> = useRef(null);
  const [isOnPause, setIsOnPause] = useState<boolean>(false);

  useEffect(() => {
    playerRef.current?.load();
    onReady?.(playerRef.current as HTMLVideoElement);
  }, [onReady]);

  const handlePause = () => {
    if (isOnPause) {
      playerRef.current?.play();
      setIsOnPause(false);
    } else {
      playerRef.current?.pause();
      setIsOnPause(true);
    }
  };

  return (
    <div className={cx(styles['player-container'])}>
      <video
        className={cx(styles.player)}
        controls={false}
        preload="auto"
        muted={mode === 'broadcast'}
        ref={playerRef}
        id="audio"
        playsInline
        autoPlay>
        <track kind="captions" src="captions.vtt" label="English" />
      </video>
      <div className={cx(styles.controls)}>
        <div className={cx(styles.left, styles.part)}>
          <div className={cx(styles.volume)}>
            <Button variant="icon" label="" icon={VolumeSVG} />
            <input type="range" min="0" max="100" />
          </div>
        </div>
        <div className={cx(styles.center, styles.part)}>
          {mode === 'watch' && <Button variant="icon" label="" icon={PlaySVG} onClick={handlePause} />}
          {mode === 'broadcast' && (
            <Button
              variant="icon"
              label=""
              icon={isMuted ? MutedMicSVG : MicSVG}
              onClick={() => onSoundMute?.(isMuted)}
            />
          )}
          {mode === 'broadcast' && (
            <Button
              variant="icon"
              label=""
              icon={isSharingScreen ? ShareActiveSVG : ShareSVG}
              onClick={() => onShareScreen?.(isSharingScreen)}
            />
          )}
          {mode === 'broadcast' && (
            <Button
              variant="icon"
              label=""
              icon={isCameraBlocked ? BLockedCameraSVG : CameraSVG}
              onClick={() => onCameraBlock?.(isCameraBlocked)}
            />
          )}
          {mode === 'broadcast' && <Button variant="icon" label="" icon={LeaveSVG} onClick={onStopStream} />}
        </div>
        <div className={cx(styles.right, styles.part)}>
          <Button variant="icon" label="" icon={FullScreenSVG} />
        </div>
      </div>
    </div>
  );
}

export { Player };
