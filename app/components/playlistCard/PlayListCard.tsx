import { PlayIcon } from "@heroicons/react/24/solid";
import { Link } from "@remix-run/react";
import { formatArtworkURL } from "~/utils/helpers";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { useOutletContext } from "@remix-run/react";
import { AppReducerActionType } from "~/appReducer";
import type { AppContextType } from "~/appReducer";

export const PlayListCard = ({
  playList,
  ...otherProps
}: {
  playList: MusicKit.Playlists;
}) => {
  const fetcher = useFetcher<MusicKit.API["album"]>();
  const { dispatch } = useOutletContext<AppContextType>();
  const imageSrc = formatArtworkURL(playList?.attributes?.artwork?.url);
  const title = playList.attributes?.name;
  const subTitle = playList.attributes?.curatorName;
  const playListId = playList.id;
  const playListUrl = `/playlist/${title?.replace(" ", "-")}/${playListId}`;

  useEffect(() => {
    if (fetcher.data) {
      return dispatch({
        type: AppReducerActionType.SET_SELECTED_SONG,
        payload: fetcher.data.relationships.tracks.data[0],
      });
    }
  }, [fetcher.data, dispatch]);

  return (
    <div className="max-w-xs" {...otherProps}>
      <Link to={playListUrl}>
        <div className="group relative cursor-pointer after:absolute after:top-0 after:left-0 after:h-full after:w-full after:rounded-md after:bg-stone-600 after:opacity-0 after:transition after:duration-300 after:ease-in-out [&:after:hover]:opacity-40">
          {imageSrc && (
            <>
              <img src={imageSrc} className="w-full rounded-md" alt={title} />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  fetcher.load(playListUrl);
                }}
                aria-label="play"
                className="absolute left-3 bottom-2 z-[1] m-auto flex h-8 w-8 items-center justify-center rounded-full opacity-0 hover:bg-indigo-500 group-hover:opacity-100 [&>svg]:inline-block"
              >
                <PlayIcon className="h-5 w-5 text-white" />
              </button>
            </>
          )}
        </div>
      </Link>

      {(title || subTitle) && (
        <div className="mt-2 flex flex-col gap-[2] text-sm">
          <div>
            <Link
              to={playListUrl}
              className="block w-full truncate text-xs hover:underline"
            >
              {title}
            </Link>
          </div>
          <span
            className={`block w-full truncate text-xs text-slate-500 ${
              !subTitle && "h-4"
            }`}
          >
            {subTitle}
          </span>
        </div>
      )}
    </div>
  );
};
