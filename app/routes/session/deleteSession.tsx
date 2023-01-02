import type { ActionFunction } from "@remix-run/node";
import { logoutUser } from "~/server/session.server";

export const action: ActionFunction = async ({ request }) => {
  return logoutUser(request);
};
