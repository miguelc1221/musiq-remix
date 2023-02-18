import { useEffect } from "react";

export const useMusicKitListener = (
  event: any,
  callback: (...args: any) => void
) => {
  useEffect(() => {
    const musicKit = window.MusicKit;

    if (musicKit?.errors?.length || !musicKit) {
      return;
    }

    const music = musicKit?.getInstance();

    if (!music) {
      return;
    }
    music.addEventListener(event, callback);

    return () => {
      music.removeEventListener(event, callback);
    };
  }, [callback, event]);
};
