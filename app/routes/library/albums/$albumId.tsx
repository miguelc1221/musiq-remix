import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction, ErrorBoundaryComponent } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { AppContextType } from "~/appReducer";
import { getLibraryAlbums } from "~/server/musicKit.server";
import { SongList } from "~/components/songList/songList";
import { formatArtworkURL, timeConversion } from "~/utils/helpers";
import { HiPlay, HiPause } from "react-icons/hi2";
import { useOutletContext } from "@remix-run/react";
import { logoutUser, requireAuthToken } from "~/server/session.server";
import { useState, useEffect } from "react";
import { MusiqErrorBoundary } from "~/components/error/musiqErrorBoundary";

export const loader: LoaderFunction = async ({ params, request }) => {
  if (!params.albumId) {
    throw new Response("Require AlbumId", {
      status: 404,
    });
  }

  const userToken = await requireAuthToken(request);

  const results = await getLibraryAlbums([params.albumId], { userToken });

  if (results.errors) {
    if (results.errors[0]?.status === "403") {
      return logoutUser(request);
    } else {
      throw new Response(results.errors[0]?.detail, {
        status: Number(results.errors[0]?.status),
      });
    }
  }

  if (!results.data?.length) {
    throw new Response("AlbumId not found", {
      status: 404,
    });
  }

  return json(results);
};

export default function LibraryAlbumRoute() {
  const results = useLoaderData<{
    data: MusicKit.Albums[];
    meta: {
      total: number;
    };
    next?: string;
  }>();

  const album = results?.data[0];
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
    <div className="pb-[100px]">
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
            className="mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-600"
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
              <HiPlay className="h-7 w-7 text-white" />
            ) : (
              <HiPause className="h-7 w-7 text-white" />
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
          className="mt-0 mr-0 ml-0 px-10 md:px-2 [&~div]:px-10 md:[&~div]:px-2"
        />
      </div>
    </div>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <MusiqErrorBoundary
      message="There was an error loading this album"
      error={error}
    />
  );
};
