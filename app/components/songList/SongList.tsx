import { SongItem } from "./SongItem";

export const SongList = ({
  songs,
}: {
  songs: (MusicKit.MusicVideos | MusicKit.Songs)[];
}) => {
  if (!songs.length) {
    return null;
  }

  return (
    <ul className="mt-4 flex flex-col px-10 text-sm">
      {songs.map((track, index) => {
        return <SongItem key={index} index={index} track={track} />;
      })}
    </ul>
  );
};
