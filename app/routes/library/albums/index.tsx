import { useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import type { LoaderFunction, ErrorBoundaryComponent } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getLibraryAlbums } from "~/server/musicKit.server";
import { requireAuthToken } from "~/server/session.server";
import { AlbumCard } from "~/components/albumCard/AlbumCard";
import { MusiqErrorBoundary } from "~/components/error/MusiqErrorBoundary";
import { PageWrapper } from "~/components/pageWrapper/PageWrapper";
import { Pagination } from "~/components/pagination/Pagination";

const offsetLimit = 100;

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const offset = url.searchParams.get("offset");

  const userToken = await requireAuthToken(request);

  const results = await getLibraryAlbums([], {
    userToken,
    limit: offsetLimit,
    ...(offset ? { offset } : {}),
  });

  return json(results);
};

export default function LibraryAlbumsRoute() {
  const results = useLoaderData<{
    data: MusicKit.Albums[];
    meta: {
      total: number;
    };
    next?: string;
  }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const offset = searchParams.getAll("offset") || 0;
  const numOffset = Number(offset);

  return (
    <PageWrapper>
      <div className="flex flex-wrap gap-5">
        {results.data.map((album) => {
          return (
            <AlbumCard
              album={album}
              key={album.id}
              className="max-w-[13rem]"
              linkToUrl={album.id}
            />
          );
        })}
      </div>
      {results.next && (
        <div className="mt-6 flex w-full items-center justify-center">
          <Pagination
            count={results.meta?.total}
            offset={numOffset}
            offsetLimit={offsetLimit}
            onNextClick={() => {
              navigate(`/library/albums?offset=${numOffset + offsetLimit}`);
            }}
            onPrevClick={() => {
              navigate(`/library/albums?offset=${numOffset - offsetLimit}`);
            }}
          />
        </div>
      )}
    </PageWrapper>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <MusiqErrorBoundary error={error} />;
};
