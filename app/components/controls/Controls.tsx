import {
  PlayIcon,
  BackwardIcon,
  ForwardIcon,
  PauseIcon,
} from "@heroicons/react/24/solid";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { ShuffleIcon } from "../icons";
import { AppReducerActionType } from "~/appReducer";
import type { PlayerType, DispatchType } from "~/appReducer";

export const Controls = ({
  player,
  dispatch,
  onRepeatClick,
  isOnRepeat,
  previousSong,
  nextSong,
}: {
  player: PlayerType;
  dispatch: DispatchType;
  onRepeatClick: () => void;
  nextSong: () => void;
  previousSong: () => void;
  isOnRepeat: boolean;
}) => {
  const isDisabled = !player.selectedSong;
  const disableColor = isDisabled
    ? "text-gray-300 hover:text-gray-300"
    : "hover:text-slate-700/60";
  const repeatOn = isOnRepeat ? "text-indigo-500" : "";

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <button className={`mr-1 ${disableColor}`} disabled={isDisabled}>
          <ShuffleIcon className="h-4 w-4" />
        </button>
        <button
          className={`${disableColor}`}
          disabled={isDisabled}
          onClick={previousSong}
        >
          <BackwardIcon className="h-7 w-7" />
        </button>
        <button
          className={`${disableColor}`}
          disabled={isDisabled}
          onClick={() => {
            if (!player.selectedSong) {
              return;
            }

            if (player?.isPlaying) {
              return dispatch({
                type: AppReducerActionType.SET_IS_PLAYING_OFF,
              });
            }

            return dispatch({ type: AppReducerActionType.SET_IS_PLAYING_ON });
          }}
        >
          {player?.isPlaying ? (
            <PauseIcon className="h-9 w-9" />
          ) : (
            <PlayIcon className="h-9 w-9" />
          )}
        </button>
        <button
          className={`${disableColor}`}
          disabled={isDisabled}
          onClick={nextSong}
        >
          <ForwardIcon className="h-7 w-7" />
        </button>
        <button
          className={`ml-1 ${disableColor} ${repeatOn}`}
          disabled={isDisabled}
          onClick={onRepeatClick}
        >
          <ArrowPathIcon className="h-5 w-5" />
        </button>
      </div>
    </>
  );
};
