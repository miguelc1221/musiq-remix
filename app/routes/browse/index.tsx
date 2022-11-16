import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { formatArtworkURL } from "~/utils/helpers";
import { getCharts } from "~/server/musicKit.server";
import { MusiqCarousel } from "~/components/musiqCarousel/musiqCarousel";
import { CheveronRightIcon } from "~/components/icons";
import { AlbumCard } from "~/components/albumCard/albumCard";
import { SongItem } from "~/components/songItem/SongItem";

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
  const { albums, songs } = useLoaderData<MusicKit.API["charts"]>();

  console.log(songs, "songs");
  return (
    <>
      <h1 className="border-b border-slate-200 pb-6 text-3xl font-bold">
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
            <AlbumCard
              key={index}
              src={formatArtworkURL(album?.attributes?.artwork?.url)}
              title={album.attributes.name}
              subTitle={album.attributes.artistName}
            />
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
      <div>
        <MusiqCarousel
          responsive={{
            desktop: {
              breakpoint: { max: 3000, min: 1024 },
              items: 3,
              slidesToSlide: 6,
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
            return <SongItem songs={item} key={index} />;
          })}
        </MusiqCarousel>
      </div>
    </>
  );
}
