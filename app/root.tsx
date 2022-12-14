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

import rccss from "react-multi-carousel/lib/styles.css";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: rccss },
];

const Document = ({ children }: { children?: ReactNode }) => {
  return (
    <html lang="en" className="text-slate-700">
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

export const loader: LoaderFunction = async () => {
  return json(developerToken);
};

export default function App() {
  const [state, dispatch] = useReducer(appReducer, appInitialState);
  const devToken = useLoaderData();

  useEffect(() => {
    const configureMusicKit = async () => {
      try {
        // Add Muskit onLoad eventListener
        const music = await window.MusicKit.configure({
          developerToken: devToken,
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

    if (!state.musicKit) {
      configureMusicKit();
    }
  }, [devToken, state.musicKit]);

  console.log(state, "STATE>>>>>>>musicKitContext>>>>");

  return (
    <Document>
      <Layout appState={{ ...state, dispatch }}>
        <Outlet context={{ ...state, dispatch }} />
      </Layout>
    </Document>
  );
}
