import type { ActionFunction } from "@remix-run/node";
import { createUserSession } from "~/server/session.server";

export const action: ActionFunction = async ({ request }) => {
  const token = (await request.formData()).get("appleMusicToken");

  if (token) {
    return createUserSession(token, "/");
  }
};
