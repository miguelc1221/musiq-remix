import { useState } from "react";
import { useOutletContext } from "@remix-run/react";
import type { AppContextType } from "~/appReducer";
import { calculateTime } from "~/utils/helpers";
import { SongControl } from "./SongControl";

export const SongItem = ({
  song,
  songs,
  index,
  albumId,
  playlistId,
  setQueueLoaded,
  ...otherProps
}: {
  song: MusicKit.Songs | MusicKit.MusicVideos;
  songs: (MusicKit.Songs | MusicKit.MusicVideos)[];
  index: number;
  albumId?: string;
  playlistId?: string;
  setQueueLoaded: (b: boolean) => void;
}) => {
  const [isMouseOver, setIsMouseOver] = useState(false);
  const { player, musicKit } = useOutletContext<AppContextType>();
  const isSelectedSong = song.id === musicKit?.nowPlayingItem?.id;

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
          isLoading={player.playerState === "LOADING"}
          isMouseOver={isMouseOver}
          isPlaying={player.playerState === "PLAYING"}
          onPlayClick={async () => {
            if (player?.playerState === "LOADING") {
              return;
            }

            if (albumId) {
              await musicKit?.setQueue({
                album: albumId,
              });
              setQueueLoaded(true);
            }

            if (playlistId) {
              await musicKit?.setQueue({
                playlist: playlistId,
              });
              setQueueLoaded(true);
            }

            await musicKit?.changeToMediaItem(song.id);
          }}
          onPauseClick={() => {
            musicKit?.pause();
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
