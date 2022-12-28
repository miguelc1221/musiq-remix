import {
  PlayIcon,
  BackwardIcon,
  ForwardIcon,
  PauseIcon,
} from "@heroicons/react/24/solid";
import { RepeatIcon, RepeatOneIcon, ShuffleIcon } from "../icons";
import type { PlayerType } from "~/appReducer";
import { useEffect, useState } from "react";

enum MusicKitRepeat {
  NONE,
  ONE,
  ALL,
}

enum MusicKitShuffle {
  OFF,
  ON,
}

export const Controls = ({
  musicKit,
  player,
}: {
  player?: PlayerType;
  musicKit?: MusicKit.MusicKitInstance;
}) => {
  const [isPlaying, setIsPlaying] = useState(player?.playerState === "PLAYING");
  const [repeatMode, setRepeatMode] = useState(0);
  const [shuffleMode, setShuffleMode] = useState(0);
  const isDisabled = !player?.queueLength;
  const disableColor = isDisabled
    ? "text-gray-300 hover:text-gray-300"
    : "hover:text-slate-700/60";

  const repeatOn =
    repeatMode === MusicKitRepeat.ONE || repeatMode === MusicKitRepeat.ALL
      ? "text-rose-400 hover:text-rose-400"
      : "";

  const shuffleOn =
    shuffleMode === MusicKitShuffle.ON
      ? "text-rose-400 hover:text-rose-400"
      : "";

  const playerState = player?.playerState;

  useEffect(() => {
    if (shuffleMode === 0 && musicKit) {
      musicKit.shuffleMode = MusicKitShuffle.ON;
    }
    if (shuffleMode === 1 && musicKit) {
      musicKit.repeatMode = MusicKitShuffle.OFF;
    }
  }, [shuffleMode, musicKit]);

  useEffect(() => {
    if (repeatMode === 0 && musicKit) {
      musicKit.repeatMode = MusicKitRepeat.ALL;
    }
    if (repeatMode === 1 && musicKit) {
      musicKit.repeatMode = MusicKitRepeat.ONE;
    }
    if (repeatMode === 2 && musicKit) {
      musicKit.repeatMode = MusicKitRepeat.ALL;
    }
  }, [repeatMode, musicKit]);

  useEffect(() => {
    if (playerState === "PAUSE") {
      setIsPlaying(false);
    }
    if (playerState === "PLAYING") {
      setIsPlaying(true);
    }
  }, [playerState]);

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        className={`mr-1 duration-200 ease-in ${disableColor} ${shuffleOn}`}
        disabled={isDisabled}
        onClick={() => {
          if (shuffleMode === MusicKitShuffle.OFF) {
            setShuffleMode(MusicKitShuffle.ON);
            return;
          }

          setShuffleMode(MusicKitShuffle.OFF);
        }}
      >
        <ShuffleIcon className="h-5 w-5" />
      </button>
      <button
        className={`duration-200 ease-in ${disableColor}`}
        disabled={isDisabled}
        onClick={async () => {
          await musicKit?.skipToPreviousItem();
        }}
      >
        <BackwardIcon className="h-7 w-7" />
      </button>
      <button
        className={`duration-200 ease-in ${disableColor}`}
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
        className={`duration-200 ease-in ${disableColor}`}
        disabled={isDisabled}
        onClick={async () => {
          const next = MusicKit.getInstance().queue.nextPlayableItem;
          if (!next) {
            await musicKit?.changeToMediaAtIndex(0);
            return;
          }
          await musicKit?.skipToNextItem();
        }}
      >
        <ForwardIcon className="h-7 w-7" />
      </button>
      <button
        className={`ml-1 cursor-default duration-200 ease-in ${disableColor} ${repeatOn}`}
        disabled={isDisabled}
        onClick={() => {
          if (repeatMode === MusicKitRepeat.NONE) {
            setRepeatMode(MusicKitRepeat.ALL);
            return;
          }

          if (repeatMode === MusicKitRepeat.ALL) {
            setRepeatMode(MusicKitRepeat.ONE);
            return;
          }

          setRepeatMode(MusicKitRepeat.NONE);
        }}
      >
        {repeatMode !== MusicKitRepeat.ONE ? (
          <RepeatIcon className="h-5 w-5" />
        ) : (
          <RepeatOneIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
};
