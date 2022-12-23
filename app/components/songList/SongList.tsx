import { SongItem } from "./SongItem";

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
    <ul className={`mt-4 flex flex-col px-10 text-sm ${className || ""}`}>
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
    </ul>
  );
};
