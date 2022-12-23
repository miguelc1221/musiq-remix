import type { PlayerType } from "~/appReducer";
import { formatArtworkURL } from "~/utils/helpers";
import { AppleIcon, MusicNote } from "../icons";
import { useRef, useEffect, useState, useCallback } from "react";
import { VolumeControl } from "../volumeControl.tsx/VolumeControl";
import { Controls } from "../controls/Controls";
import { useMusicKitListener } from "~/hooks/useMusicKitListener";
import { calculateTime } from "~/utils/helpers";

interface MusickitPlayBackTime {
  currentPlaybackDuration: number;
  currentPlaybackTime: number;
  currentPlaybackTimeRemaining: number;
}

export const TrackDisplay = ({
  player,
  musicKit,
}: {
  player?: PlayerType;
  musicKit?: MusicKit.MusicKitInstance;
}) => {
  const [currentTime, setCurrentTime] = useState<MusickitPlayBackTime | null>(
    null
  );
  const [volume, setVolume] = useState("0.4");

  const audioPlayer = useRef<HTMLAudioElement | null>(null); // reference our audio component
  const progressBar = useRef<HTMLInputElement | null>(null); // reference our progress bar
  const mouseIsDown = useRef<boolean>(false); // reference the animation

  const selectedSong = player?.selectedMediaItem;

  const getDuration = useCallback(() => {
    if (!selectedSong) {
      return 0;
    }

    return Math.ceil(
      musicKit?.isAuthorized ? selectedSong.playbackDuration / 1000 : 30
    );
  }, [selectedSong, musicKit?.isAuthorized]);

  const changePlayerCurrentTime = useCallback(
    (value: number) => {
      const duration = getDuration();
      if (progressBar.current && duration && audioPlayer.current) {
        let progressBarStyleValue = Number(value) / duration;
        let progressBarValue = value;

        if (value >= duration) {
          progressBarStyleValue = 0;
          progressBarValue = 0;
        }

        if (!mouseIsDown.current) {
          progressBar.current.value = `${progressBarValue}`;
        }

        progressBar.current.style.setProperty(
          "--seek-before-width",
          `${progressBarStyleValue * 100}%`
        );
      }
    },
    [getDuration]
  );

  const handlePlaybackTimeDidChange = useCallback(
    (state: MusickitPlayBackTime) => {
      if (progressBar.current && !mouseIsDown.current) {
        changePlayerCurrentTime(state.currentPlaybackTime);
        setCurrentTime(state);
      }
    },
    [changePlayerCurrentTime]
  );

  useMusicKitListener("playbackTimeDidChange", handlePlaybackTimeDidChange);

  useEffect(() => {
    const audioRef = document.querySelector("audio");
    audioPlayer.current = audioRef;
  }, [getDuration]);

  useEffect(() => {
    if (audioPlayer.current) {
      audioPlayer.current.volume = Number(volume);
    }
  }, [volume]);

  const getCurrentPlaybackDuration = () => {
    if (!currentTime) return;

    return calculateTime(currentTime?.currentPlaybackTimeRemaining * 1000);
  };

  const getCurrentPlaybackTime = () => {
    if (!currentTime) return;

    return calculateTime(currentTime?.currentPlaybackTime * 1000);
  };

  const changeRange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    changePlayerCurrentTime(Number(evt.target.value));
  };

  const onMouseUp = async (evt: React.SyntheticEvent<HTMLInputElement>) => {
    const eventTarget = evt.target as HTMLInputElement;
    await musicKit?.seekToTime(Number(eventTarget.value));
    mouseIsDown.current = false;
  };

  const onMouseDown = () => {
    mouseIsDown.current = true;
  };

  const onVolumeChange = (volume: string) => {
    setVolume(volume);
  };

  return (
    <>
      <Controls musicKit={musicKit} player={player} />

      <div className="grid grid-cols-[auto_1fr] items-center">
        {selectedSong ? (
          <img
            src={formatArtworkURL(
              selectedSong?.attributes?.artwork.url,
              96,
              96
            )}
            alt={selectedSong?.attributes?.name}
            className="h-[55px] w-[55px]"
          />
        ) : (
          <div className="flex h-[55px] w-[55px] items-center justify-center bg-gray-300">
            <MusicNote className="h-7 w-7" />
          </div>
        )}

        <div className="flex h-full flex-col items-center justify-center bg-slate-200 text-xs shadow-inner">
          <div className="relative flex w-full flex-1 flex-col items-center justify-center">
            {selectedSong ? (
              <>
                <span className="block">{selectedSong?.attributes?.name}</span>
                <span>
                  {selectedSong?.attributes?.artistName}-{" "}
                  {selectedSong?.attributes?.albumName}
                </span>
                <time
                  className="absolute left-2 bottom-1 text-[0.625rem] font-bold text-slate-600"
                  role="timer"
                >
                  {getCurrentPlaybackTime()}
                </time>
                <time
                  className="absolute right-2 bottom-1 text-[0.625rem] font-bold text-slate-600"
                  role="timer"
                >
                  -{getCurrentPlaybackDuration()}
                </time>
              </>
            ) : (
              <AppleIcon className="h-8 w-8" />
            )}
          </div>

          {selectedSong && (
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
                max={getDuration()}
              />
            </>
          )}
        </div>
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
