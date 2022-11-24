import { useParams, useSearchParams, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node"; // or cloudflare/deno
import { getAlbum } from "~/server/musicKit.server";
import { SongItem } from "~/components/songItem/SongItem";
import { formatArtworkURL } from "~/utils/helpers";
import { useOverlayTriggerState } from "@react-stately/overlays";
import { MusiqModal } from "~/components/modal/MusiqModal";
import { useButton } from "@react-aria/button";
import { useRef } from "react";

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
  const params = useParams();
  const [searchParams] = useSearchParams();
  const state = useOverlayTriggerState({});
  const songId = searchParams.get("sId");
  const openButtonRef = useRef(null);
  const openButton = useButton({ onPress: state.open }, openButtonRef);

  console.log(params, "PARMAS IN COMPONENT");
  console.log(songId, "songId query param");
  console.log(results, "RESULTS>>>>>>");

  return (
    <>
      <div className="flex min-h-[300px] items-center gap-6 bg-rose-100 bg-gradient-to-t from-indigo-200/75 to-rose-100 px-10">
        <div className="shrink-0">
          <img
            src={formatArtworkURL(results.attributes?.artwork.url, 300, 300)}
            alt={"album cover"}
            className="h-[250px] w-[250px]"
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
          {results.attributes?.editorialNotes?.standard && (
            <div className="max-w-[540px]">
              <div className="relative">
                <p
                  className="line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: results.attributes?.editorialNotes?.standard,
                  }}
                />
                <button
                  className="absolute right-0 bottom-[2px] pl-1 text-xs font-bold uppercase"
                  {...openButton.buttonProps}
                  ref={openButtonRef}
                >
                  More
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div>
        <ul className="mt-4 flex flex-col px-10 text-sm">
          {results.relationships.tracks.data.map((track, index) => {
            return <SongItem key={index} index={index} track={track} />;
          })}
        </ul>
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
