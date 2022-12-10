import { useState } from "react";
import { useOutletContext } from "@remix-run/react";
import { AppReducerActionType } from "~/appReducer";
import type { AppContextType } from "~/appReducer";
import { calculateTime } from "~/utils/helpers";
import { SongControl } from "./SongControl";

export const SongItem = ({
  song,
  songs,
  index,
  ...otherProps
}: {
  song: MusicKit.Songs | MusicKit.MusicVideos;
  songs: (MusicKit.Songs | MusicKit.MusicVideos)[];
  index: number;
}) => {
  const [isMouseOver, setIsMouseOver] = useState(false);
  const { dispatch, player } = useOutletContext<AppContextType>();
  const isSelectedSong = song.id === player.selectedSong?.id;

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
          defaultValue={`${index + 1}`}
          isMouseOver={isMouseOver}
          isPlaying={player.isPlaying}
          onPlayClick={() => {
            if (isSelectedSong) {
              return dispatch({
                type: AppReducerActionType.SET_IS_PLAYING_ON,
              });
            }
            return dispatch({
              type: AppReducerActionType.SET_SELECTED_SONG,
              payload: {
                selectedSong: song,
                selectedSongPlaylist: songs,
              },
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
        <span className="block font-semibold">{song.attributes?.name}</span>
        <span className="text-xs">{song.attributes?.artistName}</span>
      </div>
      <div>
        {song.attributes?.durationInMillis && (
          <time className="tabular-nums">
            {calculateTime(song.attributes?.durationInMillis / 1000)}
          </time>
        )}
      </div>
    </li>
  );
};
