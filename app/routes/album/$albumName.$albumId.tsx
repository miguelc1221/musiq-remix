import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node"; // or cloudflare/deno
import { getAlbum } from "~/server/musicKit.server";
import { SongList } from "~/components/songList/SongList";
import { formatArtworkURL } from "~/utils/helpers";
import { useOverlayTriggerState } from "@react-stately/overlays";
import { MusiqModal } from "~/components/modal/MusiqModal";
import { useButton } from "@react-aria/button";
import { useRef } from "react";
import { PlayIcon, PauseIcon } from "@heroicons/react/20/solid";
import { useOutletContext } from "@remix-run/react";
import { AppReducerActionType } from "~/appReducer";
import type { AppContextType } from "~/appReducer";

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.albumId) {
    return;
  }

  try {
    const res = await getAlbum(params.albumId);

    return res;
  } catch (error) {
    return error;
  }
};

export default function AlbumRoute() {
  const results = useLoaderData<MusicKit.API["album"]>();
  const { player, dispatch } = useOutletContext<AppContextType>();
  const state = useOverlayTriggerState({});
  const openButtonRef = useRef(null);
  const openButton = useButton({ onPress: state.open }, openButtonRef);
  const isSongInCurrentResults = results.relationships.tracks.data.find(
    (track) => {
      return track.id === player.selectedSong?.id;
    }
  );

  const isPlayerPlaying = player.isPlaying && isSongInCurrentResults;

  return (
    <>
      <div className="flex min-h-[300px] items-center gap-6 bg-rose-100 bg-gradient-to-t from-indigo-200/75 to-rose-100 px-10">
        <div className="shrink-0">
          <img
            src={formatArtworkURL(results.attributes?.artwork.url, 300, 300)}
            alt={"album cover"}
            className="h-[250px] w-[250px] drop-shadow-md"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{results.attributes?.name}</h1>
          <p className="py-2 text-lg font-semibold">
            {results.attributes?.artistName} &#183;{" "}
            <span className="uppercase">
              {results.attributes?.genreNames[0]}
            </span>{" "}
            &#183;{" "}
            {results.attributes?.releaseDate &&
              new Date(results.attributes?.releaseDate).getFullYear()}
          </p>
          <div className="max-w-[540px]">
            <div className="flex flex-col">
              {results.attributes?.editorialNotes?.standard && (
                <>
                  <p
                    className="text-sm line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html: results.attributes?.editorialNotes?.standard,
                    }}
                  />
                  <div>
                    <button
                      className="text-xs font-bold uppercase"
                      {...openButton.buttonProps}
                      ref={openButtonRef}
                    >
                      More
                    </button>
                  </div>
                </>
              )}
              <button
                aria-label="play"
                className="mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 hover:bg-indigo-600"
                onClick={() => {
                  if (!player.selectedSong || !isSongInCurrentResults) {
                    return dispatch({
                      type: AppReducerActionType.SET_SELECTED_SONG,
                      payload: {
                        selectedSong: results.relationships.tracks.data[0],
                        selectedSongPlaylist: results.relationships.tracks.data,
                      },
                    });
                  }

                  if (isPlayerPlaying) {
                    return dispatch({
                      type: AppReducerActionType.SET_IS_PLAYING_OFF,
                    });
                  }

                  return dispatch({
                    type: AppReducerActionType.SET_IS_PLAYING_ON,
                  });
                }}
              >
                {isPlayerPlaying ? (
                  <PauseIcon className="h-7 w-7 text-white" />
                ) : (
                  <PlayIcon className="h-7 w-7 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <SongList songs={results.relationships.tracks.data} />
      </div>
      <MusiqModal
        state={state}
        title={results.attributes?.name}
        subTitle={results.attributes?.artistName}
      >
        <div>
          {results.attributes?.editorialNotes?.standard && (
            <p
              className="text-sm"
              dangerouslySetInnerHTML={{
                __html: results.attributes?.editorialNotes?.standard,
              }}
            />
          )}
        </div>
      </MusiqModal>
    </>
  );
}
