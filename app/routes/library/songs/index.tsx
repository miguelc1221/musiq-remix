import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node"; // or cloudflare/deno
import { getLibrarySongs } from "~/server/musicKit.server";
import { SongList } from "~/components/songList/SongList";
import { getUserSession } from "~/server/session.server";

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
    return error;
  }
};

export default function AlbumRoute() {
  const songs = useLoaderData<MusicKit.Songs[]>();

  return <SongList songs={songs} />;
}
