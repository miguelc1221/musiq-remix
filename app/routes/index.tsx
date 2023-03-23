import { AppleLogo } from "~/components/icons";
import { PageWrapper } from "~/components/pageWrapper/pageWrapper";

export default function AboutRoute() {
  return (
    <PageWrapper className="lg:mx-0">
      <div className="flex flex-col items-center justify-center pt-[5%]">
        <AppleLogo className="h-20 w-20" />
        <h1 className="mb-6 text-5xl font-extrabold text-indigo-600">
          Musiq Remix
        </h1>
        <div className="max-w-[1100px] px-14 pb-[14rem] text-lg leading-relaxed tracking-normal md:px-8">
          <p className="mb-4">
            Musiq Remix is a music streaming app built with the goal of learning
            the{" "}
            <a
              href="https://remix.run/"
              className="font-bold text-indigo-600"
              target="_blank"
              rel="noreferrer noopener"
            >
              Remix
            </a>{" "}
            framework. It utilizes Apple's MusicKit JS, a JavaScript library
            that enables developers to access Apple Music's catalog and user's
            personal music library. This allows users to listen to their
            favorite songs and discover new music just like they would on the
            official Apple Music app.
          </p>
          <p className="text-base font-bold">
            Musiq Remix is not affliated with Apple, Inc. Apple logo and Apple
            Music are trademarks of Apple, Inc.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
