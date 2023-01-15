import getChunk from "lodash.chunk";
import { useState, useEffect } from "react";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction, ErrorBoundaryComponent } from "@remix-run/node";
import { getArtist } from "~/server/musicKit.server";
import { formatArtworkURL } from "~/utils/helpers";
import { HiPlay, HiPause } from "react-icons/hi2";
import { getUserSession } from "~/server/session.server";
import { MusiqErrorBoundary } from "~/components/error/MusiqErrorBoundary";
import { MusiqCarousel } from "~/components/musiqCarousel/musiqCarousel";
import { SongCarouselList } from "~/components/songCarouselList/SongCarouselList";
import { AlbumCard } from "~/components/albumCard/albumCard";
import { PlayListCard } from "~/components/playlistCard/PlayListCard";
import { useOutletContext } from "@remix-run/react";
import type { AppContextType } from "~/appReducer";

export const loader: LoaderFunction = async ({ request, params }) => {
  console.log(params, "PARAMS>>>");
  if (!params.artistId) {
    throw new Response("Require Artist Id", {
      status: 404,
    });
  }

  const session = await getUserSession(request);
  const userToken = session.get("appleMusicToken");

  try {
    const res = await getArtist(params.artistId, {
      "limit[artists:top-songs]": 20,
      "limit[artists:full-albums]": 20,
      views: "appears-on-albums,full-albums,top-songs,featured-playlists",
      userToken,
    });

    return res;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Unhandled error: ${error.message}`);
    }
  }
};

export default function ArtistRoute() {
  const results = useLoaderData<MusicKit.Artists>();
  const { player, musicKit } = useOutletContext<AppContextType>();
  const [isPlaying, setIsPlaying] = useState(player?.playerState === "PLAYING");

  console.log(results, "results>>");

  useEffect(() => {
    if (player.playerState === "PAUSE") {
      setIsPlaying(false);
    }
    if (player.playerState === "PLAYING") {
      setIsPlaying(true);
    }
  }, [player.playerState]);

  const topSongs = results.views["top-songs"];
  const fullAlbums = results.views["full-albums"];
  const appearsOnAlbums = results.views["appears-on-albums"];
  const playlists = results.views["featured-playlists"];

  const headerImg = formatArtworkURL(
    results.attributes?.artwork.url,
    2400,
    1350
  );

  const isSongInCurrentResults = topSongs.data.find((track) => {
    return track.id === musicKit?.nowPlayingItem?.id;
  });

  const allSongsId = topSongs.data.map((song) => song.id);
  const isPlayerPlaying = player.playerState === "PLAYING";

  return (
    <>
      <div
        className="relative mb-6 aspect-auto h-[40vh] max-h-[1680px] min-h-[350px] bg-cover bg-center bg-no-repeat after:absolute after:top-0 after:left-0 after:h-full after:w-full after:rounded-md after:bg-stone-600 after:opacity-60 after:transition after:duration-300 after:ease-in-out"
        style={{ backgroundImage: `url(${headerImg})` }}
      >
        <div className="flex h-full">
          <div className="z-10 flex items-end pl-8 pb-6 text-white">
            <div className="flex items-center gap-4">
              <button
                aria-label="play"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 hover:bg-indigo-600"
                onClick={async () => {
                  if (!player.queueLength || !isSongInCurrentResults) {
                    await musicKit?.setQueue({
                      songs: allSongsId,
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
                {isPlaying ? (
                  <HiPause className="h-7 w-7 text-white" />
                ) : (
                  <HiPlay className="h-7 w-7 text-white" />
                )}
              </button>
              <h1 className="text-5xl font-bold">{results.attributes?.name}</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-6 px-10">
        <h2 className="mb-6 pl-4 text-xl font-bold">Top Songs</h2>
        <MusiqCarousel
          responsive={{
            desktop: {
              breakpoint: { max: 3000, min: 1024 },
              items: 3,
              slidesToSlide: 3,
            },
            tablet: {
              breakpoint: { max: 1024, min: 464 },
              items: 2,
              slidesToSlide: 2,
            },
            mobile: {
              breakpoint: { max: 764, min: 0 },
              items: 1,
              slidesToSlide: 1,
            },
          }}
        >
          {getChunk(topSongs.data, 4).map((item, index) => {
            return (
              <SongCarouselList
                songs={item}
                key={index}
                allSongsId={allSongsId}
              />
            );
          })}
        </MusiqCarousel>
      </div>

      <div className="mb-6 px-10">
        <h2 className="mb-6 pl-4 text-xl font-bold">Albums</h2>
        <MusiqCarousel>
          {fullAlbums.data.map((album, index) => {
            return <AlbumCard album={album} key={index} />;
          })}
        </MusiqCarousel>
      </div>

      <div className="mb-6 px-10">
        <h2 className="mb-6 pl-4 text-xl font-bold">Appears on</h2>
        <MusiqCarousel>
          {appearsOnAlbums.data.map((album, index) => {
            return <AlbumCard album={album} key={index} />;
          })}
        </MusiqCarousel>
      </div>

      <div className="mb-6 px-10">
        <h2 className="mb-6 pl-4 text-xl font-bold">Featured Playlists</h2>
        <MusiqCarousel>
          {playlists.data.map((playlist, index) => {
            return <PlayListCard playList={playlist} key={index} />;
          })}
        </MusiqCarousel>
      </div>
    </>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <MusiqErrorBoundary
      message="There was an error loading this artist page"
      error={error}
    />
  );
};