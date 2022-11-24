import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { formatArtworkURL } from "~/utils/helpers";
import { getCharts } from "~/server/musicKit.server";
import { MusiqCarousel } from "~/components/musiqCarousel/musiqCarousel";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { AlbumCard } from "~/components/albumCard/albumCard";
import { SongList } from "~/components/songList/SongList";

import getChunk from "lodash.chunk";

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
  const { albums, songs, playlists } = useLoaderData<MusicKit.API["charts"]>();

  console.log(playlists, "playlists");
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="border-b border-slate-200 pb-6 text-3xl font-bold">
          Browse
        </h1>

        <h2 className="mb-4 pl-4 text-xl font-bold">
          <button className="flex items-center">
            {albums[0].name}
            <ChevronRightIcon className="mt-1 h-4 w-4" />
          </button>
        </h2>
        <MusiqCarousel>
          {albums[0].data.map((album, index) => {
            console.log(album, "Album>>");
            return <AlbumCard album={album} key={index} />;
          })}
        </MusiqCarousel>
      </div>
      <div>
        <h2 className="mb-4 pl-4 text-xl font-bold">
          <button className="flex items-center">
            {songs[0]?.name}
            <ChevronRightIcon className="mt-1 h-4 w-4" />
          </button>
        </h2>
        <div>
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
                breakpoint: { max: 464, min: 0 },
                items: 1,
                slidesToSlide: 1,
              },
            }}
          >
            {getChunk(songs[0].data, 4).map((item, index) => {
              return <SongList songs={item} key={index} />;
            })}
          </MusiqCarousel>
        </div>
      </div>
      <div>
        <h2 className="mb-4 pl-4 text-xl font-bold">
          <button className="flex items-center">
            {playlists[0].name}
            <ChevronRightIcon className="mt-1 h-4 w-4" />
          </button>
        </h2>
        {/* <MusiqCarousel>
          {playlists[0].data.map((playlist, index) => {
            return (
              <AlbumCard
                key={index}
                album={playlist}
              />
            );
          })}
        </MusiqCarousel> */}
      </div>
    </div>
  );
}
