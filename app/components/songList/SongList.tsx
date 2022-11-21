import { formatArtworkURL } from "~/utils/helpers";
import { PlayIcon } from "@heroicons/react/20/solid";
import { useOutletContext } from "@remix-run/react";
import { AppReducerActionType } from "~/appReducer";
import type { AppContextType } from "~/appReducer";

export const SongList = ({
  songs,
  ...otherProps
}: {
  songs: MusicKit.Songs[];
}) => {
  const { dispatch } = useOutletContext<AppContextType>();

  return (
    <div className="grid grid-cols-1 gap-2 divide-y" {...otherProps}>
      {songs.map((song, idx) => {
        return (
          <div
            key={idx}
            className="grid grid-cols-[auto_auto_1fr_auto] items-center pt-2"
          >
            <div className="group relative cursor-pointer after:absolute after:top-0 after:left-0 after:h-full after:w-full after:rounded-md after:bg-stone-600 after:opacity-0 after:transition after:duration-300 after:ease-in-out [&:after:hover]:opacity-40">
              <img
                src={formatArtworkURL(song.attributes?.artwork?.url, 96, 96)}
                alt={song.attributes?.name}
                className="h-[50px] w-[50px] rounded-md"
              />
              <button
                onClick={() => {
                  if (!song.attributes?.previews[0].url) {
                    return;
                  }
                  return dispatch({
                    type: AppReducerActionType.SET_SELECTED_SONG,
                    payload: song,
                  });
                }}
                aria-label="play"
                className="absolute bottom-0 top-0 right-0 left-0 z-[1] m-auto opacity-0 group-hover:opacity-100 [&>svg]:inline-block"
              >
                <PlayIcon className="h-5 w-5 text-white" />
              </button>
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
