import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node"; // or cloudflare/deno
import { getLibraryRecentlyAdded } from "~/server/musicKit.server";
import { getUserSession } from "~/server/session.server";
import { AlbumCard } from "~/components/albumCard/albumCard";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const session = await getUserSession(request);
    const userToken = session.get("appleMusicToken");

    if (!userToken) {
      return redirect("/");
    }

    const res = await getLibraryRecentlyAdded({ userToken, limit: 25 });

    return res;
  } catch (error) {
    return error;
  }
};

export default function RecentlyAddedRoute() {
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
              linkTo={`/library/albums/${album.id}`}
            />
          );
        })}
      </div>
    </>
  );
}
