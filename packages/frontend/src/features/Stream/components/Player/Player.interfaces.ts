export interface PlayerProps {
  onReady: (player: HTMLVideoElement) => void;
  mode: 'broadcast' | 'watch';
  isMuted?: boolean;
  onSoundMute?: (isMuted: boolean) => void;
  isVideoPlaying?: boolean;
  onVideoPlaying?: (isPlaying: boolean) => void;
  onStopStream?: () => void;
  isSharingScreen?: boolean;
  onShareScreen?: (isSharingScreen: boolean) => void;
}
