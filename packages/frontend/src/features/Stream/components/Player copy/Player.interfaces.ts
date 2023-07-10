import Video from 'video.js/dist/types/player';

export type VideoJSPlayer = Video;

export interface PlayerProps {
  onReady: (player: VideoJSPlayer) => void;
}
