import { HiPlay, HiForward, HiBackward, HiPause } from "react-icons/hi2";
import { TbRepeat, TbRepeatOnce, TbArrowsShuffle } from "react-icons/tb";
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
  const shuffleMode = player?.shuffleMode;
  const repeatMode = player?.repeatMode;
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

  let shuffleAriaLabel = "Enable shuffle";
  let repeatAriaLabel = "Enable repeat one";

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
          if (!musicKit) return;

          if (shuffleMode === MusicKitShuffle.OFF) {
            musicKit.shuffleMode = MusicKitShuffle.ON;
            shuffleAriaLabel = "Disable shuffle";
            return;
          }

          musicKit.shuffleMode = MusicKitShuffle.OFF;
          shuffleAriaLabel = "Enable shuffle";
        }}
        aria-label={shuffleAriaLabel}
      >
        <TbArrowsShuffle className="h-5 w-5" aria-hidden={true} />
      </button>
      <button
        className={`duration-200 ease-in ${disableColor}`}
        disabled={isDisabled}
        onClick={async () => {
          await musicKit?.skipToPreviousItem();
        }}
        aria-label={"Previous"}
      >
        <HiBackward className="h-7 w-7" aria-hidden={true} />
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
        aria-label={!isPlaying ? "Play" : "Pause"}
      >
        {!isPlaying ? (
          <HiPlay className="h-9 w-9" aria-hidden={true} />
        ) : (
          <HiPause className="h-9 w-9" aria-hidden={true} />
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
        aria-label={"Next"}
      >
        <HiForward className="h-7 w-7" aria-hidden={true} />
      </button>
      <button
        className={`ml-1 duration-200 ease-in ${disableColor} ${repeatOn}`}
        disabled={isDisabled || !musicKit?.isAuthorized}
        onClick={() => {
          if (!musicKit) return;

          if (repeatMode === MusicKitRepeat.NONE) {
            musicKit.repeatMode = MusicKitRepeat.ALL;
            repeatAriaLabel = "Enable repeat one";
            return;
          }

          if (repeatMode === MusicKitRepeat.ALL) {
            musicKit.repeatMode = MusicKitRepeat.ONE;
            repeatAriaLabel = "Disable repeat";
            return;
          }
          musicKit.repeatMode = MusicKitRepeat.NONE;
          repeatAriaLabel = "Enable repeat";
        }}
        aria-label={repeatAriaLabel}
      >
        {repeatMode !== MusicKitRepeat.ONE ? (
          <TbRepeat className="h-5 w-5" aria-hidden={true} />
        ) : (
          <TbRepeatOnce className="h-5 w-5" aria-hidden={true} />
        )}
      </button>
    </div>
  );
};
