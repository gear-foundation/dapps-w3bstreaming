import React, { MutableRefObject } from 'react';
import videojs from 'video.js';
import { PlayerProps, VideoJSPlayer } from './Player.interfaces';
import 'video.js/dist/video-js.css';
import '@videojs/http-streaming';

const videoJsOptions = {
  autoplay: true,
  controls: true,
  responsive: true,
  liveui: true,
};

function Player({ onReady }: PlayerProps) {
  const videoRef = React.useRef<HTMLDivElement>(null);
  const playerRef: MutableRefObject<VideoJSPlayer | null> = React.useRef(null);

  React.useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement('video-js');

      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current?.appendChild(videoElement);

      playerRef.current = videojs(videoElement, videoJsOptions, () => {
        videojs.log('player is ready');
        playerRef.current?.load();
        if (onReady) {
          onReady(playerRef.current as VideoJSPlayer);
        }
      });
    }
  }, [videoRef, onReady]);

  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} className="video-js" id="video-js" />
    </div>
  );
}

export { Player };
