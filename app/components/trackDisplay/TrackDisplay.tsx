import type { PlayerType, DispatchType } from "~/appReducer";
import { formatArtworkURL } from "~/utils/helpers";
import { AppleIcon, MusicNote } from "../icons";
import { useRef, useEffect, useState, useCallback } from "react";
import { VolumeControl } from "../volumeControl.tsx/VolumeControl";

export const TrackDisplay = ({
  player,
  dispatch,
}: {
  player: PlayerType;
  dispatch: DispatchType;
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState("0.4");

  const audioPlayer = useRef<HTMLAudioElement | null>(null); // reference our audio component
  const progressBar = useRef<HTMLInputElement | null>(null); // reference our progress bar
  const animationRef = useRef<number | null>(null); // reference the animation
  const durationRef = useRef<number | null>(null); // reference the animation
  const mouseIsDown = useRef<boolean>(false); // reference the animation

  useEffect(() => {
    if (audioPlayer.current) {
      audioPlayer.current.volume = Number(volume);
    }
  }, [volume]);

  const onLoadedMetadata = () => {
    if (audioPlayer.current && progressBar.current) {
      const seconds = Math.ceil(audioPlayer.current.duration);
      durationRef.current = seconds;
      progressBar.current.max = `${seconds}`;
    }
  };

  const changePlayerCurrentTime = useCallback(() => {
    if (progressBar.current && durationRef.current) {
      progressBar.current.style.setProperty(
        "--seek-before-width",
        `${(Number(progressBar.current.value) / durationRef.current) * 100}%`
      );
      setCurrentTime(Number(progressBar.current.value));
    }
  }, []);

  const whilePlaying = useCallback(() => {
    if (progressBar.current && audioPlayer.current) {
      if (!mouseIsDown.current) {
        progressBar.current.value = `${audioPlayer.current.currentTime}`;
      }
      changePlayerCurrentTime();
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  }, [changePlayerCurrentTime]);

  useEffect(() => {
    if (audioPlayer.current && player.selectedSong) {
      if (player.isPlaying) {
        audioPlayer.current.play();
        animationRef.current = requestAnimationFrame(whilePlaying);
      } else {
        audioPlayer.current.pause();
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      }
    }
  }, [player.selectedSong, player.isPlaying, whilePlaying]);

  const calculateTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
  };

  const changeRange = () => {
    if (audioPlayer.current && progressBar.current) {
      changePlayerCurrentTime();
    }
  };

  const onMouseUp = () => {
    if (audioPlayer.current && progressBar.current) {
      audioPlayer.current.currentTime = Number(progressBar.current.value);
      mouseIsDown.current = false;
    }
  };

  const onMouseDown = () => {
    mouseIsDown.current = true;
  };

  const onVolumeChange = (volume: string) => {
    setVolume(volume);
  };

  return (
    <>
      <div className="grid grid-cols-[auto_1fr] items-center">
        {player.selectedSongInfo ? (
          <img
            src={formatArtworkURL(
              player.selectedSongInfo?.attributes?.artwork.url,
              96,
              96
            )}
            alt={player.selectedSongInfo?.attributes?.name}
            className="h-[55px] w-[55px]"
          />
        ) : (
          <div className="flex h-[55px] w-[55px] items-center justify-center bg-gray-300">
            <MusicNote className="h-7 w-7" />
          </div>
        )}

        <div className="flex h-full flex-col items-center justify-center bg-slate-200 text-xs shadow-inner">
          <div className="relative flex w-full flex-1 flex-col items-center justify-center">
            {player.selectedSongInfo ? (
              <>
                <span className="block">
                  {player.selectedSongInfo?.attributes?.name}
                </span>
                <span>
                  {player.selectedSongInfo?.attributes?.artistName}-{" "}
                  {player.selectedSongInfo?.attributes?.albumName}
                </span>
                <time
                  className="invisible absolute left-2 bottom-0 text-[0.625rem] font-bold text-slate-600 group-hover/audioBar:visible "
                  role="timer"
                >
                  {calculateTime(currentTime)}
                </time>
                <time
                  className="invisible absolute right-2 bottom-0 text-[0.625rem] font-bold text-slate-600 group-hover/audioBar:visible "
                  role="timer"
                >
                  -
                  {durationRef.current &&
                    progressBar.current &&
                    !isNaN(durationRef.current) &&
                    calculateTime(
                      durationRef.current - Number(progressBar.current.value)
                    )}
                </time>
              </>
            ) : (
              <AppleIcon className="h-8 w-8" />
            )}
          </div>

          {player.selectedSong && (
            <>
              <label htmlFor='playback-progress"' className="sr-only">
                Playback Progress
              </label>
              <input
                className="progressBar w-full"
                type="range"
                defaultValue="0"
                min="0"
                ref={progressBar}
                onChange={changeRange}
                onMouseUp={onMouseUp}
                onMouseDown={onMouseDown}
              />
            </>
          )}
        </div>
        <audio
          preload="metadata"
          src={player.selectedSong}
          ref={audioPlayer}
          onLoadedMetadata={onLoadedMetadata}
        />
      </div>

      <VolumeControl
        onVolumeChange={onVolumeChange}
        min="0"
        max="1"
        value={volume}
      />
    </>
  );
};
