import { AppleLogo } from "~/components/icons";

export default function AboutRoute() {
  return (
    <div className="mx-10 flex flex-col items-center justify-center pt-[5%]">
      <AppleLogo className="h-20 w-20" />
      <h1 className="mb-6 text-5xl font-extrabold text-indigo-500">
        Musiq Remix
      </h1>
      <div className="px-14 pb-[14rem] text-lg leading-relaxed tracking-normal">
        <p className="mb-4">
          Musiq Remix is a music streaming app that is a clone of Apple Music,
          built with{" "}
          <a href="https://remix.run/" className="font-bold text-indigo-500">
            Remix
          </a>
          . It utilizes Apple's MusicKit JS, a JavaScript library that enables
          developers to access Apple Music's catalog and user's personal music
          library. This allows users to listen to their favorite songs and
          discover new music just like they would on the official Apple Music
          app.
        </p>
        <p className="text-base font-bold">
          Musiq Remix is not affliated with Apple, Inc. Apple logo and Apple
          Music are trademarks of Apple, Inc.
        </p>
      </div>
    </div>
  );
}
