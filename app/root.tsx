import type { ReactNode } from "react";
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
import { useEffect, useRef } from "react";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node"; // or cloudflare/deno
import { developerToken } from "./server/developerToken.server";

import rccss from "react-multi-carousel/lib/styles.css";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => [
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

export type ContextType = {
  musicKit?: MusicKit.MusicKitInstance;
};

export default function App() {
  const devToken = useLoaderData();
  const musicKitContext = useRef<ContextType>({});

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

        musicKitContext.current.musicKit = music;
      } catch (err) {
        console.log(err);
      }
    };

    configureMusicKit();
  }, [devToken]);

  return (
    <Document>
      <Layout musicKit={musicKitContext.current.musicKit}>
        <Outlet context={musicKitContext.current.musicKit} />
      </Layout>
    </Document>
  );
}

