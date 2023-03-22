import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction, ErrorBoundaryComponent } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getLibraryRecentlyAdded } from "~/server/musicKit.server";
import { logoutUser, requireAuthToken } from "~/server/session.server";
import { AlbumCard } from "~/components/albumCard/albumCard";
import { MusiqErrorBoundary } from "~/components/error/musiqErrorBoundary";
import { PageWrapper } from "~/components/pageWrapper/pageWrapper";

export const loader: LoaderFunction = async ({ request }) => {
  const userToken = await requireAuthToken(request);

  const results = await getLibraryRecentlyAdded({ userToken, limit: 25 });

  if (results.errors) {
    if (results.errors[0]?.status === "403") {
      return logoutUser(request);
    } else {
      throw new Response(results.errors[0]?.detail, {
        status: Number(results.errors[0]?.status),
      });
    }
  }

  return json(results.data);
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
