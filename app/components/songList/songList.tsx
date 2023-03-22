import { SongItem } from "./songItem";

export const SongList = ({
  songs,
  albumId,
  playlistId,
  setQueueLoaded,
  className,
}: {
  songs: (MusicKit.MusicVideos | MusicKit.Songs)[];
  albumId?: string;
  playlistId?: string;
  className?: string;
  setQueueLoaded?: (b: boolean) => void;
}) => {
  if (!songs.length) {
    return null;
  }

  return (
    <div role="grid" className="text-sm">
      <div
        aria-hidden="true"
        role="row"
        className={`sticky top-0 z-10 -ml-10 -mr-10 mb-4 bg-gray-100 px-[2.5rem] md:top-[42px] ${
          className || ""
        }`}
      >
        <div className="flex w-full items-center rounded-lg py-2 px-5 font-semibold">
          <span
            role="columnheader"
            className="mr-4 flex h-6 w-6 items-center justify-center"
          >
            #
          </span>
          <span role="columnheader" className="flex-1">
            NAME
          </span>
          <span role="columnheader" className="mr-[2.3rem] flex-1 md:hidden">
            ALBUM
          </span>
          <span role="columnheader">TIME</span>
        </div>
      </div>
      {songs.map((song, index) => {
        return (
          <SongItem
            key={index}
            index={index}
            song={song}
            songs={songs}
            albumId={albumId}
            playlistId={playlistId}
            setQueueLoaded={setQueueLoaded}
          />
        );
      })}
    </div>
  );
};
