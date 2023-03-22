import getChunk from "lodash.chunk";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  CITY_CHARTS_ID,
  getCharts,
  getPlaylist,
} from "~/server/musicKit.server";
import { MusiqCarousel } from "~/components/musiqCarousel/musiqCarousel";
import { AlbumCard } from "~/components/albumCard/albumCard";
import { SongCarouselList } from "~/components/songCarouselList/songCarouselList";
import { PlayListCard } from "~/components/playlistCard/playListCard";
import { PageWrapper } from "~/components/pageWrapper/pageWrapper";

export const loader: LoaderFunction = async () => {
  const [charts, cityCharts] = await Promise.all([
    getCharts(["songs", "albums", "playlists"], {
      limit: 36,
      "fields[songs]":
        "artistName,artistUrl,artwork,contentRating,editorialArtwork,name,releaseDate,url",
    }),
    getPlaylist(`?ids=${CITY_CHARTS_ID.join(",")}`),
  ]);

  return json({ ...charts.results, cityCharts: cityCharts.data });
};

export default function BrowseIndex() {
  const { albums, songs, playlists, cityCharts } = useLoaderData<{
    albums: MusicKit.SearchChartResult<MusicKit.Albums>[];
    "music-videos": MusicKit.SearchChartResult<MusicKit.MusicVideos>[];
    songs: MusicKit.SearchChartResult<MusicKit.Songs>[];
    playlists: MusicKit.SearchChartResult<MusicKit.Playlists>[];
    cityCharts: MusicKit.Playlists[];
  }>();

  return (
    <PageWrapper className="max-w-[2000px]">
      <h1 className="mb-4 border-b border-slate-200 pb-6 text-3xl font-bold">
        Browse
      </h1>
      <div className="flex flex-col gap-9">
        <div>
          <h2 className="mb-6 pl-4 text-xl font-bold">{albums[0].name}</h2>
          <MusiqCarousel>
            {albums[0].data.map((album, index) => {
              return <AlbumCard album={album} key={index} />;
            })}
          </MusiqCarousel>
        </div>
        <div>
          <h2 className="mb-6 pl-4 text-xl font-bold">{songs[0]?.name}</h2>
          <div>
            <MusiqCarousel
              responsive={{
                desktop: {
                  breakpoint: { max: 5000, min: 1024 },
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
                return (
                  <SongCarouselList
                    songs={item}
                    key={index}
                    allSongs={songs[0].data}
                  />
                );
              })}
            </MusiqCarousel>
          </div>
        </div>
        <div>
          <h2 className="mb-6 pl-4 text-xl font-bold">{playlists[0].name}</h2>
          <MusiqCarousel>
            {playlists[0].data.map((playlist, index) => {
              return <PlayListCard key={index} playList={playlist} />;
            })}
          </MusiqCarousel>
        </div>
        <div>
          <h2 className="mb-6 pl-4 text-xl font-bold">City Charts</h2>
          <MusiqCarousel>
            {cityCharts.map((playlist, index) => {
              return <PlayListCard key={index} playList={playlist} />;
            })}
          </MusiqCarousel>
        </div>
      </div>
    </PageWrapper>
  );
}
