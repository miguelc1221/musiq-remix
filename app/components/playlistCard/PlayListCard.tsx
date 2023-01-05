import { HiPlay } from "react-icons/hi2";
import { Link } from "@remix-run/react";
import { formatArtworkURL, formatUrlName } from "~/utils/helpers";
import { useOutletContext } from "@remix-run/react";
import type { AppContextType } from "~/appReducer";

export const PlayListCard = ({
  playList,
  ...otherProps
}: {
  playList: MusicKit.Playlists;
}) => {
  const { musicKit } = useOutletContext<AppContextType>();
  const imageSrc = formatArtworkURL(playList?.attributes?.artwork?.url);
  const title = playList.attributes?.name;
  const subTitle = playList.attributes?.curatorName;
  const playListId = playList.id;
  const playListUrl = `/playlist/${formatUrlName(title || "")}/${playListId}`;

  return (
    <div className="max-w-xs" {...otherProps}>
      <Link to={playListUrl}>
        <div className="group relative cursor-pointer after:absolute after:top-0 after:left-0 after:h-full after:w-full after:rounded-md after:bg-stone-600 after:opacity-0 after:transition after:duration-300 after:ease-in-out [&:after:hover]:opacity-40">
          {imageSrc && (
            <>
              <img src={imageSrc} className="w-full rounded-md" alt={title} />
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  await musicKit?.setQueue({
                    playlist: playListId,
                    startPlaying: true,
                  });
                }}
                aria-label="play"
                className="absolute left-3 bottom-2 z-[1] m-auto flex h-8 w-8 items-center justify-center rounded-full bg-stone-500 opacity-0 hover:bg-indigo-500 group-hover:opacity-100 [&>svg]:inline-block"
              >
                <HiPlay className="h-5 w-5 text-white" />
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
