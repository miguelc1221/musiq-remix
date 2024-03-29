import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction, ErrorBoundaryComponent } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getAlbum } from "~/server/musicKit.server";
import { SongList } from "~/components/songList/songList";
import { formatArtworkURL, timeConversion } from "~/utils/helpers";
import { useOverlayTriggerState } from "@react-stately/overlays";
import { MusiqModal } from "~/components/modal/musiqModal";
import { useButton } from "@react-aria/button";
import { useRef, useState, useEffect } from "react";
import { useOutletContext } from "@remix-run/react";
import type { AppContextType } from "~/appReducer";
import { getUserSession } from "~/server/session.server";
import { MusiqErrorBoundary } from "~/components/error/musiqErrorBoundary";
import { PauseIcon, PlayIcon } from "~/components/icons";

export const loader: LoaderFunction = async ({ request, params }) => {
  if (!params.albumId) {
    throw new Response("Require AlbumId", {
      status: 404,
    });
  }

  const session = await getUserSession(request);
  const userToken = session.get("appleMusicToken");

  const results = await getAlbum(params.albumId, { userToken });

  return json(results.data[0]);
};

export default function AlbumRoute() {
  const results = useLoaderData<MusicKit.Albums>();
  const { player, musicKit } = useOutletContext<AppContextType>();
  const [isPlaying, setIsPlaying] = useState(player?.playerState === "PLAYING");
  const [queueLoaded, setQueueLoaded] = useState(false);
  const state = useOverlayTriggerState({});
  const openButtonRef = useRef(null);
  const openButton = useButton({ onPress: state.open }, openButtonRef);
  const isSongInCurrentResults = results.relationships.tracks.data.find(
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

  const totalAlbumTime = results.relationships.tracks.data.reduce(
    (acc, val) => {
      if (val.attributes?.durationInMillis) {
        acc += val.attributes?.durationInMillis;
      }
      return acc;
    },
    0
  );

  return (
    <div className="pb-[100px]">
      <div className="flex min-h-[380px] items-center gap-6 bg-rose-100 bg-gradient-to-t from-indigo-200/75 to-rose-100 px-10 md:min-h-[550px] md:flex-col md:pt-[75px]">
        <div className="shrink-0">
          <img
            src={formatArtworkURL(results.attributes?.artwork.url, 300, 300)}
            alt={"album cover"}
            className="h-[250px] w-[250px] drop-shadow-md md:h-[170px] md:w-[170px]"
          />
        </div>

        <div className="flex h-[250px] flex-col">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{results.attributes?.name}</h1>
            <p className="text-lg font-semibold">
              {results.attributes?.artistName} &#183;{" "}
              <span className="uppercase">
                {results.attributes?.genreNames[0]}
              </span>{" "}
              &#183;{" "}
              {results.attributes?.releaseDate &&
                new Date(results.attributes?.releaseDate).getFullYear()}
            </p>
            <p className="py-2">
              {results.attributes?.trackCount} Songs,{" "}
              {timeConversion(totalAlbumTime)}
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
                    <div className="self-end">
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
              </div>
            </div>
          </div>
          <button
            aria-label="play"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-600"
            onClick={async () => {
              if (!player.queueLength || !isSongInCurrentResults) {
                await musicKit?.setQueue({
                  album: results.id,
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
          songs={results.relationships.tracks.data}
          albumId={
            !isSongInCurrentResults || !queueLoaded ? results.id : undefined
          }
          setQueueLoaded={setQueueLoaded}
          className="mt-0 mr-0 ml-0 px-10 md:px-2 [&~div]:px-10 md:[&~div]:px-2"
        />
      </div>
      <MusiqModal
        state={state}
        title={results.attributes?.name}
        subTitle={results.attributes?.artistName}
      >
        <div>
          {results.attributes?.editorialNotes?.standard && (
            <p
              className="text-sm leading-normal"
              dangerouslySetInnerHTML={{
                __html: results.attributes?.editorialNotes?.standard,
              }}
            />
          )}
        </div>
      </MusiqModal>
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
