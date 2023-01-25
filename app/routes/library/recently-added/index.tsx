import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction, ErrorBoundaryComponent } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getLibraryRecentlyAdded } from "~/server/musicKit.server";
import { requireAuthToken } from "~/server/session.server";
import { AlbumCard } from "~/components/albumCard/AlbumCard";
import { MusiqErrorBoundary } from "~/components/error/MusiqErrorBoundary";
import { PageWrapper } from "~/components/pageWrapper/PageWrapper";

export const loader: LoaderFunction = async ({ request }) => {
  const userToken = await requireAuthToken(request);

  const results = await getLibraryRecentlyAdded({ userToken, limit: 25 });

  return json(results);
};

export default function LibraryRecentlyAddedRoute() {
  const albums = useLoaderData<MusicKit.Albums[]>();

  return (
    <PageWrapper>
      <div className="flex flex-wrap gap-5">
        {albums.map((album) => {
          return (
            <AlbumCard
              album={album}
              key={album.id}
              className="max-w-[13rem]"
              linkToUrl={`/library/albums/${album.id}`}
            />
          );
        })}
      </div>
    </PageWrapper>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <MusiqErrorBoundary error={error} />;
};
