import type {
  MetaFunction,
  ErrorBoundaryComponent,
  LinksFunction,
  LoaderFunction,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
  Outlet,
} from "@remix-run/react";
import { getSelectorsByUserAgent } from "react-device-detect";
import Layout from "./components/layout/layout";
import styles from "./tailwind.css";
import type { ReactNode } from "react";
import { useEffect, useReducer } from "react";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node"; // or cloudflare/deno
import { developerToken } from "./server/developerToken.server";
import {
  appReducer,
  appInitialState,
  AppReducerActionType,
} from "./appReducer";
import { getUserSession } from "./server/session.server";
import { MusicKitEvents } from "./components/musicKitEvents/musicKitEvents";

import rccss from "react-multi-carousel/lib/styles.css";

const description =
  "A music streaming app that is a clone of Apple Music, built with Remix. It utilizes Apple's MusicKit JS, a JavaScript library that enables developers to access Apple Music's catalog and user's personal music library.";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Musiq Remix",
  viewport: "width=device-width,initial-scale=1",
  description,
  "og:description": description,
});

export const links: LinksFunction = () => [
  {
    rel: "icon",
    href: "/favicon.svg",
    type: "image/svg+xml",
  },

  { rel: "preconnect", href: "https://rsms.me/" },
  { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
  { rel: "stylesheet", href: rccss },
  { rel: "stylesheet", href: styles },
];

const Document = ({ children }: { children?: ReactNode }) => {
  return (
    <html lang="en" className="leading-7 text-slate-700">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="overflow-hidden">
        {children}
        <ScrollRestoration />
        <script
          src="https://js-cdn.music.apple.com/musickit/v3/musickit.js"
          async
        ></script>
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
};

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.log(error);
  return (
    <Document>
      <Layout>
        <section className="p-6">
          <div className="relative mx-auto w-full max-w-7xl items-center px-5 py-12 md:px-12 lg:px-24">
            <h1>There was an Error</h1>
            <p>{error.message}</p>
          </div>
        </section>
      </Layout>
    </Document>
  );
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getUserSession(request);
  const token = session.get("appleMusicToken");
  const userAgent = request.headers.get("user-agent");
  let isMobile = false;

  if (userAgent) {
    isMobile = getSelectorsByUserAgent(userAgent).isMobile;
  }

  return json({ developerToken, sessionToken: !!token, isMobile });
};

export default function App() {
  const [state, dispatch] = useReducer(appReducer, appInitialState);

  const { developerToken, sessionToken, isMobile } = useLoaderData();

  useEffect(() => {
    const configureMusicKit = async () => {
      try {
        const music = await window.MusicKit.configure({
          developerToken,
          app: {
            name: "musiqremix",
            build: "1.0.0",
          },
        });

        dispatch({
          type: AppReducerActionType.SET_MUSICKIT_INSTANCE,
          payload: music,
        });
      } catch (err) {
        console.log(err);
      }
    };

    if (!state.musicKit && developerToken && window.MusicKit) {
      configureMusicKit();
    } else {
      document.addEventListener("musickitloaded", configureMusicKit);
    }

    return () => {
      document.removeEventListener("musickitloaded", configureMusicKit);
    };
  }, [developerToken, state.musicKit]);

  return (
    <Document>
      {state?.musicKit && (
        <MusicKitEvents dispatch={dispatch} player={state?.player} />
      )}
      <Layout
        isMobile={isMobile}
        appState={{ ...state, dispatch }}
        isAuthenticated={
          state?.musicKit && state.musicKit.isAuthorized && sessionToken
        }
      >
        <Outlet context={{ ...state, dispatch }} />
      </Layout>
    </Document>
  );
}
