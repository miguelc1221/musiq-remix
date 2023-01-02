import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { addToLibrary } from "~/server/musicKit.server";
import { getUserSession } from "~/server/session.server";

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const id = formData.get("id");
    const type = formData.get("type");

    const session = await getUserSession(request);
    const userToken = session.get("appleMusicToken");

    if (!userToken || !id || !type) {
      return redirect("/");
    }

    await addToLibrary({ [`ids[${type}]`]: id, userToken });

    return json({ ok: "success" });
  } catch (error) {
    console.log(error, "ERROR - ADDING SONG TO LIBRARY");
    if (error instanceof Error) {
      return json({ error: error.message });
    }
  }
};
