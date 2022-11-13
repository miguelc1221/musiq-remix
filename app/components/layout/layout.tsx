import type { ReactNode } from "react";
import { Link } from "@remix-run/react";
import { AppleLogo, SquaresIcon, UserCircleIcon } from "../icons";

export default function Layout({
  musicKit,
  children,
}: {
  musicKit?: MusicKit.MusicKitInstance;
  children?: ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <aside className="sticky top-0 h-screen min-w-[250px] border-r-2">
        <nav>
          <ul className="flex flex-col">
            <li>
              <h1 className="p-6 text-2xl font-bold text-primaryBlue">
                <Link to="/" className="flex items-center">
                  <AppleLogo className="mr-2" />
                  Musiq Remix
                </Link>
              </h1>
            </li>
            <li className="hover:bg-slate-100">
              <Link to="/" className="flex w-full py-3 px-6">
                <SquaresIcon /> <span className="ml-2">Browse</span>
              </Link>
            </li>
            <li className="hover:bg-slate-100">
              <span
                className="flex w-full cursor-pointer py-3 px-6"
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
      <div className="z-[1] h-auto w-full overflow-auto bg-slate-50 pb-[55px]">
        <main className="mx-10 h-full flex-1">{children}</main>
        <div className="fixed bottom-0 h-[55px] w-full bg-gray-100"></div>
      </div>
    </div>
  );
}
