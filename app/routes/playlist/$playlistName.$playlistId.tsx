import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node"; // or cloudflare/deno
import { getPlaylist } from "~/server/musicKit.server";
import { SongList } from "~/components/songList/SongList";
import { formatArtworkURL } from "~/utils/helpers";
import { PlayIcon, PauseIcon } from "@heroicons/react/20/solid";
import { useOutletContext } from "@remix-run/react";
import type { AppContextType } from "~/appReducer";
import { useState, useEffect } from "react";
import { getUserSession } from "~/server/session.server";
import { MusiqErrorBoundary } from "~/components/error/MusiqErrorBoundary";

export const loader: LoaderFunction = async ({ request, params }) => {
  if (!params.playlistId) {
    return;
  }

  const session = await getUserSession(request);
  const userToken = session.get("appleMusicToken");

  try {
    const res = await getPlaylist(`/${params.playlistId}`, { userToken });
    return res;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Unhandled error: ${error.message}`);
    }
  }
};

export default function PlaylistRoute() {
  const results = useLoaderData<MusicKit.Playlists[]>();
  const { player, musicKit } = useOutletContext<AppContextType>();
  const [isPlaying, setIsPlaying] = useState(player?.playerState === "PLAYING");
  const [queueLoaded, setQueueLoaded] = useState(false);
  const playlist = results[0];

  const isSongInCurrentResults = playlist.relationships.tracks.data.find(
    (track) => {
      return track.id === musicKit?.nowPlayingItem?.id;
    }
  );

  const isPlayerPlaying =
    player.playerState === "PLAYING" && isSongInCurrentResults;

  useEffect(() => {
    if (player.playerState === "PAUSE") {
      setIsPlaying(false);
    }
    if (player.playerState === "PLAYING") {
      setIsPlaying(true);
    }
  }, [player.playerState]);

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
            onClick={async () => {
              if (!player.queueLength || !isSongInCurrentResults) {
                await musicKit?.setQueue({
                  playlist: playlist.id,
                  startPlaying: true,
                });
                return;
              }
              if (isPlayerPlaying) {
                return musicKit?.pause();
              }
              return musicKit?.play();
            }}
          >
            {!isPlaying ? (
              <PlayIcon className="h-7 w-7 text-white" />
            ) : (
              <PauseIcon className="h-7 w-7 text-white" />
            )}
          </button>
        </div>
      </div>
      <div>
        <SongList
          songs={playlist.relationships.tracks.data}
          playlistId={
            !isSongInCurrentResults || !queueLoaded ? playlist.id : undefined
          }
          setQueueLoaded={setQueueLoaded}
          className="mt-0 mr-0 ml-0 px-10 [&~div]:px-10"
        />
      </div>
    </>
  );
}


export function ErrorBoundary() {
  return <MusiqErrorBoundary />;
}
