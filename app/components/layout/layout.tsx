import type { ReactNode } from "react";
import { Link, useLocation } from "@remix-run/react";
import { AppleLogo, SquaresIcon, UserCircleIcon } from "../icons";
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
        className="sticky top-0 h-screen min-w-[300px] bg-gray-100"
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
                className={`flex w-full rounded-lg p-2 ${
                  isBrowseUrl
                    ? "bg-indigo-500 text-white"
                    : "hover:bg-slate-200"
                }`}
              >
                <SquaresIcon /> <span className="ml-2">Browse</span>
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
                <UserCircleIcon /> <span className="ml-2">Login</span>
              </span>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="z-[1] h-auto w-full overflow-auto bg-white">
        <main className="h-full flex-1">
          <div className="bg-neutral-00 fixed bottom-0 z-10 h-[55px] w-full bg-gray-100/80 backdrop-blur-md"></div>
          <div className="mx-10 pb-[55px] pt-[37px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
