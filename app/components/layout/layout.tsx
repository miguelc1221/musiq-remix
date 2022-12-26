import type { ReactNode } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { NavLink, useLocation, useFetcher } from "@remix-run/react";
import { AlbumIcon, AppleLogo, MusicSongNote } from "../icons";
import {
  UserCircleIcon,
  Squares2X2Icon,
  ClockIcon,
} from "@heroicons/react/20/solid";
import { TrackDisplay } from "../trackDisplay/TrackDisplay";
import type { AppContextType } from "~/appReducer";

const NavLinkWrapper = ({
  children,
  to,
}: {
  children: React.ReactNode;
  to: string;
}) => {
  const defaultClasses = "flex w-full items-center rounded-lg p-2";
  const activeClasses = "bg-indigo-500 text-white";
  const hoverClass = "hover:bg-slate-200";

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? `${defaultClasses} ${activeClasses}`
          : `${defaultClasses} ${hoverClass}`
      }
    >
      {children}
    </NavLink>
  );
};

export default function Layout({
  appState,
  isAuthenticated,
  children,
}: {
  appState?: AppContextType;
  isAuthenticated?: boolean;
  children?: ReactNode;
}) {
  const fetcher = useFetcher();
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isAlbumUrl = location.pathname.includes("/album/");
  const isLibraryAlbumUrl = location.pathname.includes("/albums/");
  const isPlaylistUrl = location.pathname.includes("/playlist/");

  useEffect(() => {
    containerRef.current?.scrollTo(0, 0);
  }, [location.pathname]);

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
                <NavLink to="/" className="flex items-end">
                  <AppleLogo className="mr-2" />
                  Musiq Remix
                </NavLink>
              </h1>
            </li>
            <li className="px-8">
              <NavLinkWrapper to="/browse">
                <Squares2X2Icon className="h-5 w-5" />
                <span className="ml-2">Browse</span>
              </NavLinkWrapper>
            </li>
          </ul>
          <div className="mt-6">
            <span className="ml-2 px-8 text-[11px] font-bold">MY LIBRARY</span>
            <ul className="mt-2">
              {isAuthenticated && (
                <>
                  <li className="px-8">
                    <NavLinkWrapper to="/library/recently-added">
                      <ClockIcon className="h-5 w-5" />
                      <span className="ml-2">Recently Added</span>
                    </NavLinkWrapper>
                  </li>
                  <li className="px-8">
                    <NavLinkWrapper to="/library/albums">
                      <AlbumIcon className="h-5 w-5" />
                      <span className="ml-2">Albums</span>
                    </NavLinkWrapper>
                  </li>
                  <li className="px-8">
                    <NavLinkWrapper to="/library/songs">
                      <MusicSongNote className="h-5 w-5" />
                      <span className="ml-2">Songs</span>
                    </NavLinkWrapper>
                  </li>
                </>
              )}
              <li className="px-8 pt-6">
                <span
                  className="flex w-full cursor-pointer items-center justify-center border-t border-slate-300 p-4 font-bold hover:text-indigo-500"
                  onClick={async () => {
                    if (isAuthenticated) {
                      await appState?.musicKit?.unauthorize();
                      return;
                    }

                    try {
                      const token = await appState?.musicKit?.authorize();

                      if (token) {
                        fetcher.submit(
                          { appleMusicToken: token },
                          { method: "post", action: "/session/newSession" }
                        );
                      }
                    } catch (error) {
                      console.log(error, "Authorization Error");
                    }
                  }}
                >
                  <UserCircleIcon className="h-6 w-6" />{" "}
                  <span className="ml-2">
                    {isAuthenticated ? "Sign Out" : "Login"}
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
      <div
        className="z-[1] h-auto w-full overflow-auto bg-white"
        ref={containerRef}
      >
        <main className="h-full flex-1">
          <div className="fixed bottom-0 z-10 h-[65px] w-[calc(100%_-_300px)] bg-gray-100">
            <div
              tabIndex={-1}
              className="grid h-full grid-cols-[1fr_2fr_1fr] items-center"
            >
              <TrackDisplay
                player={appState?.player}
                musicKit={appState?.musicKit}
              />
            </div>
          </div>
          <div
            className={`pb-[100px] ${
              isAlbumUrl || isPlaylistUrl || isLibraryAlbumUrl
                ? ""
                : "mx-10 pt-[37px]"
            }`}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
