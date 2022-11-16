import { formatArtworkURL } from "~/utils/helpers";

export const SongItem = ({
  songs,
  ...otherProps
}: {
  songs: MusicKit.Songs[];
}) => {
  return (
    <div className="grid grid-cols-1 gap-2 divide-y" {...otherProps}>
      {songs.map((song, idx) => {
        return (
          <div
            key={idx}
            className="grid grid-cols-[auto_auto_1fr_auto] items-center pt-2"
          >
            <div className="relative cursor-pointer after:absolute after:top-0 after:left-0 after:h-full after:w-full after:rounded-md after:bg-stone-500 after:opacity-0 after:transition after:duration-300 after:ease-in-out [&:after:hover]:opacity-40">
              <img
                src={formatArtworkURL(song.attributes?.artwork?.url, 50, 50)}
                alt={song.attributes?.name}
                className="rounded-md"
              />
            </div>
            <div className="col-span-2 ml-2 text-sm ">
              <div>
                <a
                  href="#"
                  className="block w-full truncate text-[13px] hover:underline"
                >
                  {song.attributes?.name}
                </a>
              </div>
              <span className="block w-full truncate text-xs text-slate-500">
                {song.attributes?.artistName}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
