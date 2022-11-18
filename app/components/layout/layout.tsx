import type { ReactNode } from "react";
import { Link, useLocation } from "@remix-run/react";
import { AppleLogo } from "../icons";
import { UserCircleIcon, Squares2X2Icon } from "@heroicons/react/20/solid";
import { Controls } from "../controls/Controls";
import { TrackDisplay } from "../trackDisplay/TrackDisplay";
import { VolumeControl } from "../volumeControl.tsx/VolumeControl";

export default function Layout({
  musicKit,
  children,
}: {
  musicKit?: MusicKit.MusicKitInstance;
  children?: ReactNode;
}) {
  const location = useLocation();

  const isBrowseUrl = location.pathname === "/browse";

  return (
    <div className="flex h-screen">
      <aside
        aria-label="Sidebar"
        className="sticky top-0 h-screen min-w-[300px] border-r bg-gray-100"
      >
        <nav>
          <ul className="flex flex-col gap-3">
            <li>
              <h1 className="flex items-center pl-[1.2rem] pt-6 pb-8 text-2xl font-bold text-indigo-500">
                <Link to="/" className="flex items-end">
                  <AppleLogo className="mr-2" />
                  Musiq Remix
                </Link>
              </h1>
            </li>
            <li className="px-8">
              <Link
                to="/"
                className={`flex w-full items-center rounded-lg p-2 ${
                  isBrowseUrl
                    ? "bg-indigo-500 text-white"
                    : "hover:bg-slate-200"
                }`}
              >
                <Squares2X2Icon className="h-5 w-5" />
                <span className="ml-2">Browse</span>
              </Link>
            </li>
            <li className="px-8 pt-6">
              <span
                className="flex w-full cursor-pointer items-center justify-center border-t border-slate-300 p-4 font-bold hover:text-indigo-500"
                onClick={() => {
                  console.log(musicKit, "musickit on login click");
                  // return musicKit?.musicKit?.getInstance()?.authorize();
                }}
              >
                <UserCircleIcon className="h-6 w-6" />{" "}
                <span className="ml-2">Login</span>
              </span>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="z-[1] h-auto w-full overflow-auto bg-white">
        <main className="h-full flex-1">
          <div className="fixed bottom-0 z-10 h-[65px] w-[calc(100%_-_300px)] bg-gray-100/70 backdrop-blur-lg">
            <div className="grid h-full grid-cols-[1fr_2fr_1fr] items-center">
              <Controls />
              <TrackDisplay />
              <VolumeControl />
            </div>
          </div>
          <div className="mx-10 pb-[100px] pt-[37px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
