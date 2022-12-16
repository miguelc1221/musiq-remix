import {
  PlayIcon,
  BackwardIcon,
  ForwardIcon,
  PauseIcon,
} from "@heroicons/react/24/solid";
import { RepeatIcon, RepeatOneIcon, ShuffleIcon } from "../icons";
import type { PlayerType } from "~/appReducer";
import { useEffect, useState } from "react";

export const Controls = ({
  musicKit,
  player,
}: {
  player?: PlayerType;
  musicKit?: MusicKit.MusicKitInstance;
}) => {
  const [isPlaying, setIsPlaying] = useState(player?.playerState === "PLAYING");
  const isDisabled = !player?.queueLength;
  const disableColor = isDisabled
    ? "text-gray-300 hover:text-gray-300"
    : "hover:text-slate-700/60";
  // const repeatOn = isOnRepeat ? "text-indigo-500 hover:text-indigo-600" : "";

  const playerState = player?.playerState;

  useEffect(() => {
    if (playerState === "PAUSE") {
      setIsPlaying(false);
    }
    if (playerState === "PLAYING") {
      setIsPlaying(true);
    }
  }, [playerState]);

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <button className={`mr-1 ${disableColor}`} disabled={isDisabled}>
          <ShuffleIcon className="h-4 w-4" />
        </button>
        <button
          className={`${disableColor}`}
          disabled={isDisabled}
          onClick={async () => {
            await musicKit?.skipToPreviousItem();
          }}
        >
          <BackwardIcon className="h-7 w-7" />
        </button>
        <button
          className={`${disableColor}`}
          disabled={isDisabled}
          onClick={() => {
            if (!musicKit || playerState === "LOADING") {
              return;
            }

            if (playerState === "PLAYING") {
              return musicKit.pause();
            }

            return musicKit.play();
          }}
        >
          {!isPlaying ? (
            <PlayIcon className="h-9 w-9" />
          ) : (
            <PauseIcon className="h-9 w-9" />
          )}
        </button>
        <button
          className={`${disableColor}`}
          disabled={isDisabled}
          onClick={async () => {
            await musicKit?.skipToNextItem();
          }}
        >
          <ForwardIcon className="h-7 w-7" />
        </button>
        {/* <button
          className={`ml-1 cursor-default ${disableColor} ${repeatOn}`}
          disabled={isDisabled}
          onClick={onRepeatClick}
        >
          {isOnRepeat === 1 || !isOnRepeat ? (
            <RepeatIcon className="h-5 w-5" />
          ) : (
            <RepeatOneIcon className="h-5 w-5" />
          )}
        </button> */}
      </div>
    </>
  );
};;;;;;;
