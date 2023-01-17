import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction, ErrorBoundaryComponent } from "@remix-run/node";
import { redirect } from "@remix-run/node"; // or cloudflare/deno
import { getLibraryAlbums } from "~/server/musicKit.server";
import { getUserSession } from "~/server/session.server";
import { AlbumCard } from "~/components/albumCard/AlbumCard";
import { MusiqErrorBoundary } from "~/components/error/MusiqErrorBoundary";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const session = await getUserSession(request);
    const userToken = session.get("appleMusicToken");

    if (!userToken) {
      return redirect("/");
    }

    const res = await getLibraryAlbums(null, { userToken });

    return res;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Unhandled error: ${error.message}`);
    }
  }
};

export default function AlbumRoute() {
  const albums = useLoaderData<MusicKit.Albums[]>();
  return (
    <>
      <div className="flex flex-wrap gap-5">
        {albums.map((album) => {
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
    </>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <MusiqErrorBoundary error={error} />;
};