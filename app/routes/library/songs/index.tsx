import { useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import type { LoaderFunction, ErrorBoundaryComponent } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getLibrarySongs } from "~/server/musicKit.server";
import { SongList } from "~/components/songList/songList";
import { logoutUser, requireAuthToken } from "~/server/session.server";
import { MusiqErrorBoundary } from "~/components/error/musiqErrorBoundary";
import { PageWrapper } from "~/components/pageWrapper/pageWrapper";
import { Pagination } from "~/components/pagination/pagination";

const offsetLimit = 100;

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const offset = url.searchParams.get("offset");

  const userToken = await requireAuthToken(request);

  const results = await getLibrarySongs([], {
    userToken,
    limit: offsetLimit,
    ...(offset ? { offset } : {}),
  });

  if (results.errors) {
    if (results.errors[0]?.status === "403") {
      return logoutUser(request);
    } else {
      throw new Response(results.errors[0]?.detail, {
        status: Number(results.errors[0]?.status),
      });
    }
  }

  return json(results);
};

export default function LibrarySongsRoute() {
  const results = useLoaderData<{
    data: MusicKit.Songs[];
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
    <PageWrapper className="!pt-[0rem] md:mx-0 md:pt-[42px]">
      <div>
        <SongList songs={results.data} className="md:ml-0 md:mr-0 md:px-0" />
      </div>
      {results.next && (
        <div className="mt-6 flex w-full items-center justify-center">
          <Pagination
            count={results.meta?.total}
            offset={numOffset}
            offsetLimit={offsetLimit}
            onNextClick={() => {
              navigate(`/library/songs?offset=${numOffset + offsetLimit}`);
            }}
            onPrevClick={() => {
              navigate(`/library/songs?offset=${numOffset - offsetLimit}`);
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
