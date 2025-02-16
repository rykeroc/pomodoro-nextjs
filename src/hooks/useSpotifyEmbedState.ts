import {useEffect, useState} from "react";

interface SpotifyEmbedState {
  isPlaying: boolean;
}

export default function useSpotifyEmbedState(): SpotifyEmbedState {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://open.spotify.com') return;

      const data = event.data;
      if (typeof data === 'object' && data.type === 'playback_update') {
        setIsPlaying(!data.payload.isPaused);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return {isPlaying};
}