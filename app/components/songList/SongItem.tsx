import { useState } from "react";
import { PlayIcon, PauseIcon } from "@heroicons/react/20/solid";
import { useOutletContext } from "@remix-run/react";
import { AppReducerActionType } from "~/appReducer";
import type { AppContextType } from "~/appReducer";
import { calculateTime } from "~/utils/helpers";

const SongControl = ({
  isSelectedSong,
  isMouseOver,
  isPlaying,
  onPlayClick,
  onPauseClick,
  count,
}: {
  isSelectedSong: boolean;
  isMouseOver: boolean;
  isPlaying: boolean;
  count: number;
  onPlayClick: () => void;
  onPauseClick: () => void;
}) => {
  const isSelectedSongPlaying = isPlaying && isSelectedSong;

  if (
    (isMouseOver && !isSelectedSong) ||
    (isSelectedSong && !isSelectedSongPlaying)
  ) {
    return (
      <button onClick={onPlayClick}>
        <PlayIcon className="h-5 w-5" />
      </button>
    );
  }

  if (isSelectedSong) {
    if (isPlaying) {
      return (
        <button onClick={onPauseClick}>
          <PauseIcon className="h-6 w-6" />
        </button>
      );
    }
  }

  return <>{count}</>;
};

export const SongItem = ({
  track,
  index,
  ...otherProps
}: {
  track: MusicKit.Songs | MusicKit.MusicVideos;
  index: number;
}) => {
  const [isMouseOver, setIsMouseOver] = useState(false);
  const { dispatch, player } = useOutletContext<AppContextType>();
  const isSelectedSong = track.id === player.selectedSongInfo?.id;

  return (
    <li
      className={`flex	w-full items-center rounded-lg py-3 px-5 ${
        isSelectedSong ? "bg-indigo-500 text-white" : "hover:bg-slate-200 "
      }`}
      onMouseOver={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
      {...otherProps}
    >
      <div className="mr-4 flex h-6 w-6 items-center justify-center">
        <SongControl
          count={index + 1}
          isMouseOver={isMouseOver}
          isPlaying={player.isPlaying}
          onPlayClick={() => {
            if (isSelectedSong) {
              return dispatch({ type: AppReducerActionType.SET_IS_PLAYING_ON });
            }
            return dispatch({
              type: AppReducerActionType.SET_SELECTED_SONG,
              payload: track,
            });
          }}
          onPauseClick={() => {
            return dispatch({
              type: AppReducerActionType.SET_IS_PLAYING_OFF,
            });
          }}
          isSelectedSong={isSelectedSong}
        />
      </div>
      <div className="flex-1">
        <span className="block font-semibold">{track.attributes?.name}</span>
        <span className="text-xs">{track.attributes?.artistName}</span>
      </div>
      <div>
        {track.attributes?.durationInMillis && (
          <time className="tabular-nums">
            {calculateTime(track.attributes?.durationInMillis / 1000)}
          </time>
        )}
      </div>
    </li>
  );
};
