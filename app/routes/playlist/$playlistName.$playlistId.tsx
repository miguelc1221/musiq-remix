import { useParams, useSearchParams, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node"; // or cloudflare/deno
import { getPlaylist } from "~/server/musicKit.server";
import { SongList } from "~/components/songList/SongList";
import { formatArtworkURL } from "~/utils/helpers";
import { PlayIcon, PauseIcon } from "@heroicons/react/20/solid";

export const loader: LoaderFunction = async ({ params }) => {
  console.log(params, "PARAMS>>>");
  if (!params.playlistId) {
    return;
  }

  try {
    const res = await getPlaylist(params.playlistId);
    console.log(res, "RES>>");
    return res;
  } catch (error) {
    return error;
  }
};

export default function PlaylistRoute() {
  const results = useLoaderData<MusicKit.API["playlist"]>();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const songId = searchParams.get("sId");

  console.log(params, "PARMAS IN COMPONENT");
  console.log(songId, "songId query param");
  console.log(results, "RESULTS>>>>>>");

  return (
    <>
      <div className="flex min-h-[300px] items-center gap-6 bg-rose-100 bg-gradient-to-t from-indigo-200/75 to-rose-100 px-10">
        <div className="shrink-0">
          <img
            src={formatArtworkURL(results.attributes?.artwork?.url, 300, 300)}
            alt={"album cover"}
            className="h-[250px] w-[250px] drop-shadow-md"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{results.attributes?.name}</h1>
          <p className="py-2 text-lg font-semibold">
            <span className="uppercase">{results.attributes?.curatorName}</span>
          </p>
          <button
            onClick={(e) => {}}
            aria-label="play"
            className="mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 hover:bg-indigo-600"
          >
            <PlayIcon className="h-7 w-7 text-white" />
          </button>
        </div>
      </div>
      <div>
        <SongList songs={results.relationships.tracks.data} />
      </div>
    </>
  );
}
