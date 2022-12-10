import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node"; // or cloudflare/deno
import { getPlaylist } from "~/server/musicKit.server";
import { SongList } from "~/components/songList/SongList";
import { formatArtworkURL } from "~/utils/helpers";
import { PlayIcon, PauseIcon } from "@heroicons/react/20/solid";
import { useOutletContext } from "@remix-run/react";
import { AppReducerActionType } from "~/appReducer";
import type { AppContextType } from "~/appReducer";

export const loader: LoaderFunction = async ({ params }) => {
  if (!params.playlistId) {
    return;
  }

  try {
    const res = await getPlaylist(`/${params.playlistId}`);
    return res;
  } catch (error) {
    return error;
  }
};

export default function PlaylistRoute() {
  const results = useLoaderData<MusicKit.Playlists[]>();
  const { player, dispatch } = useOutletContext<AppContextType>();

  const playlist = results[0];

  return (
    <>
      <div className="flex min-h-[300px] items-center gap-6 bg-rose-100 bg-gradient-to-t from-indigo-200/75 to-rose-100 px-10">
        <div className="shrink-0">
          <img
            src={formatArtworkURL(playlist.attributes?.artwork?.url, 300, 300)}
            alt={"album cover"}
            className="h-[250px] w-[250px] drop-shadow-md"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{playlist.attributes?.name}</h1>
          <p className="py-2 text-lg font-semibold">
            <span className="uppercase">
              {playlist.attributes?.curatorName}
            </span>
          </p>
          <button
            aria-label="play"
            className="mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 hover:bg-indigo-600"
            onClick={() => {
              if (!player.selectedSong) {
                return dispatch({
                  type: AppReducerActionType.SET_SELECTED_SONG,
                  payload: {
                    selectedSong: playlist.relationships.tracks.data[0],
                    selectedSongPlaylist: playlist.relationships.tracks.data,
                  },
                });
              }

              if (player?.isPlaying) {
                return dispatch({
                  type: AppReducerActionType.SET_IS_PLAYING_OFF,
                });
              }

              return dispatch({
                type: AppReducerActionType.SET_IS_PLAYING_ON,
              });
            }}
          >
            {player.isPlaying ? (
              <PauseIcon className="h-7 w-7 text-white" />
            ) : (
              <PlayIcon className="h-7 w-7 text-white" />
            )}{" "}
          </button>
        </div>
      </div>
      <div>
        <SongList songs={playlist.relationships.tracks.data} />
      </div>
    </>
  );
}
