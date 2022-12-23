import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node"; // or cloudflare/deno
import { getLibraryAlbums } from "~/server/musicKit.server";
import { SongList } from "~/components/songList/SongList";
import { formatArtworkURL, timeConversion } from "~/utils/helpers";
import { PlayIcon, PauseIcon } from "@heroicons/react/20/solid";
import { useOutletContext } from "@remix-run/react";
import type { AppContextType } from "~/appReducer";
import { getUserSession } from "~/server/session.server";
import { useState, useEffect } from "react";

export const loader: LoaderFunction = async ({ params, request }) => {
  if (!params.albumId) {
    return;
  }

  try {
    const session = await getUserSession(request);
    const userToken = session.get("appleMusicToken");

    if (!userToken) {
      return redirect("/");
    }

    const res = await getLibraryAlbums([params.albumId], { userToken });

    return res;
  } catch (error) {
    return error;
  }
};

export default function AlbumRoute() {
  const results = useLoaderData<MusicKit.Albums[]>();
  const album = results[0];
  const { player, musicKit } = useOutletContext<AppContextType>();
  const [isPlaying, setIsPlaying] = useState(player?.playerState === "PLAYING");
  const [queueLoaded, setQueueLoaded] = useState(false);
  const isSongInCurrentResults = album.relationships.tracks.data.find(
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

  const totalAlbumTime = album.relationships.tracks.data.reduce((acc, val) => {
    if (val.attributes?.durationInMillis) {
      acc += val.attributes?.durationInMillis;
    }
    return acc;
  }, 0);

  return (
    <>
      <div className="flex min-h-[300px] items-center gap-6 bg-rose-100 bg-gradient-to-t from-indigo-200/75 to-rose-100 px-10">
        <div className="shrink-0">
          <img
            src={formatArtworkURL(album.attributes?.artwork.url, 300, 300)}
            alt={"album cover"}
            className="h-[250px] w-[250px] drop-shadow-md"
          />
        </div>
        <div className="flex h-[250px] flex-col">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{album.attributes?.name}</h1>
            <p className="py-2 text-lg font-semibold">
              {album.attributes?.artistName} &#183;{" "}
              <span className="uppercase">
                {album.attributes?.genreNames[0]}
              </span>{" "}
              &#183;{" "}
              {album.attributes?.releaseDate &&
                new Date(album.attributes?.releaseDate).getFullYear()}
            </p>
            <p>
              {album.attributes?.trackCount} Songs,{" "}
              {timeConversion(totalAlbumTime)}
            </p>
          </div>
          <button
            aria-label="play"
            className="mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 hover:bg-indigo-600"
            onClick={async () => {
              if (!player.queueLength || !isSongInCurrentResults) {
                await musicKit?.setQueue({
                  album: album.id,
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
          songs={album.relationships.tracks.data}
          albumId={
            !isSongInCurrentResults || !queueLoaded ? album.id : undefined
          }
          setQueueLoaded={setQueueLoaded}
        />
      </div>
    </>
  );
}