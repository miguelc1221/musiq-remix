import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { formatArtworkURL } from "~/utils/helpers";
import { getCharts } from "~/server/musicKit.server";
import { MusiqCarousel } from "~/components/musiqCarousel/musiqCarousel";
import { CheveronRightIcon } from "~/components/icons";

export const loader: LoaderFunction = async () => {
  try {
    const res = await getCharts(["songs", "albums", "playlists"], {
      limit: 36,
    });
    return res;
  } catch (error) {
    return error;
  }
};

export default function BrowseIndex() {
  const { albums, songs } = useLoaderData<MusicKit.API["charts"]>();

  console.log(songs, "songs");
  return (
    <>
      <h1 className="border-b border-slate-200 pt-6 pb-6 text-3xl font-bold">
        Browse
      </h1>
      <h2 className="my-4 pl-4 text-xl font-bold">
        <button className="flex items-center">
          {albums[0].name}
          <CheveronRightIcon
            height={"h-4"}
            width={"w-4"}
            strokeWidth={3}
            className="mt-[2px]"
          />
        </button>
      </h2>
      <MusiqCarousel>
        {albums[0].data.map((album: any, index: any) => {
          return (
            <div key={index} className="albumCard mb-4 max-w-xs">
              <div className="overflow-hidden rounded-md bg-cover bg-no-repeat drop-shadow-md">
                <img
                  src={formatArtworkURL(album?.attributes?.artwork?.url)}
                  className="w-full rounded-md"
                  alt={album.attributes.name}
                />
                <div className="absolute top-0 right-0 bottom-0 left-0 h-full w-full overflow-hidden rounded-md bg-stone-500 bg-fixed opacity-0 drop-shadow-md transition duration-300 ease-in-out"></div>
              </div>
              <div className="mt-2 flex flex-col gap-[2] text-sm">
                <div>
                  <a href="#" className="block w-full truncate hover:underline">
                    {album.attributes.name}
                  </a>
                </div>
                <span className="text-slate-400 ">
                  {album.attributes.artistName}
                </span>
              </div>
            </div>
          );
        })}
      </MusiqCarousel>

      <h2 className="my-4 pl-4 text-xl font-bold">
        <button className="flex items-center">
          {songs[0]?.name}
          <CheveronRightIcon
            height={"h-4"}
            width={"w-4"}
            strokeWidth={3}
            className="mt-[2px]"
          />
        </button>
      </h2>
    </>
  );
}
