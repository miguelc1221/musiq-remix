import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction, ErrorBoundaryComponent } from "@remix-run/node";
import { redirect } from "@remix-run/node"; // or cloudflare/deno
import { getLibrarySongs } from "~/server/musicKit.server";
import { SongList } from "~/components/songList/SongList";
import { getUserSession } from "~/server/session.server";
import { MusiqErrorBoundary } from "~/components/error/MusiqErrorBoundary";

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const session = await getUserSession(request);
    const userToken = session.get("appleMusicToken");

    if (!userToken) {
      return redirect("/");
    }

    const res = await getLibrarySongs(null, { userToken });

    return res;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Unhandled error: ${error.message}`);
    }
  }
};

export default function AlbumRoute() {
  const songs = useLoaderData<MusicKit.Songs[]>();

  return <SongList songs={songs} />;
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return <MusiqErrorBoundary error={error} />;
};
