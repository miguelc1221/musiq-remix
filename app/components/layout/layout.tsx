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
        className="sticky top-0 h-screen min-w-[275px]"
      >
        <nav>
          <ul className="flex flex-col gap-3">
            <li>
              <h1 className="flex h-[55px] items-center pl-[1.2rem] text-2xl font-bold text-primaryColor">
                <Link to="/" className="flex items-center">
                  <AppleLogo className="mr-2" />
                  Musiq Remix
                </Link>
              </h1>
            </li>
            <li className="px-6 pt-3">
              <Link
                to="/"
                className={`flex w-full rounded-lg p-2 ${
                  isBrowseUrl
                    ? "bg-primaryColor text-white"
                    : "hover:bg-slate-200"
                }`}
              >
                <SquaresIcon /> <span className="ml-2">Browse</span>
              </Link>
            </li>
            <li className="px-6">
              <span
                className="flex w-full cursor-pointer rounded-lg p-2 hover:bg-gray-100"
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
      <div className="z-[1] h-auto w-full overflow-auto bg-gray-100">
        <main className="h-full flex-1 ">
          <div className="bg-neutral-00 fixed top-0 z-10 h-[55px] w-full bg-gray-300"></div>
          <div className="mx-10 h-full pt-[55px] ">{children}</div>
        </main>
      </div>
    </div>
  );
}
