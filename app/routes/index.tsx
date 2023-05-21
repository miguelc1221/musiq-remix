import { AppleLogo, GithubIcon } from "~/components/icons";
import { PageWrapper } from "~/components/pageWrapper/pageWrapper";

export default function AboutRoute() {
  return (
    <PageWrapper className="lg:mx-0">
      <div className="flex flex-col items-center justify-center pt-[8%] text-center">
        <AppleLogo className="h-20 w-20" />
        <h1 className="mb-6 text-5xl font-extrabold text-indigo-600">
          Musiq Remix
        </h1>
        <div className="max-w-[1100px] px-14 pb-[14rem] text-lg leading-relaxed tracking-normal md:px-8 md:pb-0">
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
          <p className="mt-6 flex items-center justify-center">
            <a
              href="https://github.com/miguelc1221/musiq-remix"
              target={"_blank"}
              rel="noreferrer"
              className="ease focus:shadow-outline flex w-[150px] select-none items-center justify-center space-x-2 rounded-md border border-indigo-600 bg-indigo-600 px-4 py-2 text-white transition duration-500 hover:bg-indigo-700 focus:outline-none"
            >
              <GithubIcon className="h-6 w-6" />
              <span>Github</span>
            </a>
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
