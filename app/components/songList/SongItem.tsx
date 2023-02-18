import clsx from "clsx";
import { useState } from "react";
import { useOutletContext, useSearchParams } from "@remix-run/react";
import type { AppContextType } from "~/appReducer";
import { calculateTime, formatArtworkURL } from "~/utils/helpers";
import { SongControl } from "./SongControl";
import { MdExplicit } from "react-icons/md";
import { HiPlusCircle } from "react-icons/hi2";
import { useFetcher } from "@remix-run/react";

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
  setQueueLoaded?: (b: boolean) => void;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryId = searchParams.get("i");
  const fetcher = useFetcher();
  const [isMouseOver, setIsMouseOver] = useState(false);
  const { player, musicKit } = useOutletContext<AppContextType>();
  const isSelectedSong = queryId
    ? song.id === queryId
    : song.id === musicKit?.nowPlayingItem?.id;
  const isAuthenticated = musicKit?.isAuthorized;
  // Types need to be updated for v3
  const inLibrary = (song.attributes as any)?.inLibrary;

  return (
    <div
      role="row"
      onMouseOver={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
      {...otherProps}
    >
      <div
        tabIndex={0}
        className={clsx("flex w-full items-center rounded-lg py-3 px-5", {
          "bg-indigo-600 text-white": isSelectedSong,
          "hover:bg-slate-200": !isSelectedSong,
        })}
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
              }

              if (playlistId) {
                await musicKit?.setQueue({
                  playlist: playlistId,
                });
              }

              if (!albumId || !playlistId) {
                await musicKit?.setQueue({
                  songs: songs.map((song) => song.id),
                });
              }

              if (setQueueLoaded) {
                setQueueLoaded(true);
              }

              if (queryId) {
                setSearchParams({ i: song.id });
              }
              await musicKit?.changeToMediaItem(song.id);
            }}
            onPauseClick={() => {
              musicKit?.pause();
            }}
            isSelectedSong={isSelectedSong}
          />
        </div>
        <div className="flex flex-1 items-center">
          <img
            className="mr-2 h-[40px] w-[40px] drop-shadow-md"
            src={formatArtworkURL(song.attributes?.artwork.url, 90, 90)}
            alt={song.attributes?.name}
          />
          <div>
            <span className="block font-semibold">{song.attributes?.name}</span>
            <span className="flex items-center text-xs">
              {song.attributes?.contentRating === "explicit" && (
                <span className="mr-1">
                  <MdExplicit className="h-4 w-4" />
                </span>
              )}
              {song.attributes?.artistName}
            </span>
          </div>
        </div>
        <div className="flex-1 md:hidden">
          <span>{song.attributes?.albumName}</span>
        </div>
        <div className="flex items-center">
          <button
            className={clsx("mr-4", {
              invisible: !isMouseOver || inLibrary || !isAuthenticated,
            })}
            onClick={() => {
              return fetcher.submit(
                { id: song.id, type: "songs" },
                { method: "post", action: "/library/actions/add" }
              );
            }}
          >
            <HiPlusCircle
              className={"h-6 w-6 text-indigo-600 hover:text-indigo-600"}
            />
          </button>

          {song.attributes?.durationInMillis && (
            <time className="tabular-nums">
              {calculateTime(song.attributes?.durationInMillis)}
            </time>
          )}
        </div>
      </div>
    </div>
  );
};
