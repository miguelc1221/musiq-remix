import { useState } from "react";
import { Link } from "@remix-run/react";
import { formatArtworkURL, getLinkToUrl } from "~/utils/helpers";
import { useOutletContext } from "@remix-run/react";
import type { AppContextType } from "~/appReducer";
import { SongControl } from "../songList/songControl";
import { ExplicitIcon } from "../icons";

const SongCarouselListItem = ({
  song,
  songs,
  allSongsId,
  ...otherProps
}: {
  song: MusicKit.Songs;
  songs: MusicKit.Songs[];
  allSongsId: string[];
}) => {
  const [isMouseOver, setIsMouseOver] = useState(false);
  const { player, musicKit } = useOutletContext<AppContextType>();
  const isSelectedSong = song.id === player?.selectedMediaItem?.id;
  const contentRating = song.attributes?.contentRating === "explicit";

  return (
    <div
      {...otherProps}
      className="grid grid-cols-[auto_auto_1fr_auto] items-center pt-2"
    >
      <div
        className={`relative cursor-pointer after:absolute after:top-0 after:left-0 after:h-full after:w-full after:rounded-md after:bg-stone-600 after:opacity-0 after:transition after:duration-300 after:ease-in-out ${
          isMouseOver || isSelectedSong ? "[&:after]:opacity-40" : ""
        }`}
        onMouseOver={() => setIsMouseOver(true)}
        onMouseLeave={() => setIsMouseOver(false)}
      >
        <img
          src={formatArtworkURL(song.attributes?.artwork?.url, 96, 96)}
          alt={song.attributes?.name}
          className="h-[50px] w-[50px] rounded-md drop-shadow-md"
        />
        <SongControl
          className={`absolute bottom-0 top-0 right-0 left-0 z-[1] m-auto flex items-center justify-center text-white opacity-0 [&>svg]:inline-block ${
            isMouseOver || isSelectedSong ? "opacity-100" : ""
          }`}
          isMouseOver={isMouseOver}
          isPlaying={player.playerState === "PLAYING"}
          isLoading={player.playerState === "LOADING"}
          onPlayClick={async () => {
            await musicKit?.setQueue({
              songs: allSongsId,
            });

            await musicKit?.changeToMediaItem(song.id);
          }}
          onPauseClick={() => musicKit?.pause()}
          isSelectedSong={isSelectedSong}
        />
      </div>
      <div className="col-span-2 ml-2 text-sm ">
        <div>
          <span className="block w-full truncate text-[13px]">
            {song.attributes?.name}
          </span>
        </div>
        <div className="flex">
          <Link
            className="truncate text-xs text-slate-500 hover:underline"
            to={getLinkToUrl(song.attributes?.artistUrl)}
          >
            {song.attributes?.artistName}
          </Link>
          {contentRating && (
            <span className="ml-1">
              <ExplicitIcon className="h-4 w-4" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export const SongCarouselList = ({
  songs,
  allSongs = [],
  ...otherProps
}: {
  songs: MusicKit.Songs[];
  allSongs: MusicKit.Songs[];
}) => {
  const allSongsId = allSongs.map((song) => song.id);

  return (
    <div className="grid grid-cols-1 gap-2 divide-y" {...otherProps}>
      {songs.map((song, idx) => {
        return (
          <SongCarouselListItem
            song={song}
            songs={songs}
            key={idx}
            allSongsId={allSongsId}
          />
        );
      })}
    </div>
  );
};
