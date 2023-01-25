import type { ReactNode } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { NavLink, useLocation, useFetcher } from "@remix-run/react";
import { AppleLogo } from "../icons";
import { IoIosAlbums, IoIosMusicalNote } from "react-icons/Io";
import { MdInfoOutline } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { HiSquares2X2, HiClock } from "react-icons/hi2";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { SiApplemusic } from "react-icons/si";
import { TrackDisplay } from "../trackDisplay/TrackDisplay";
import type { AppContextType } from "~/appReducer";
import { SearchBox } from "~/routes/search";
import type { RemixNavLinkProps } from "@remix-run/react/dist/components";

const NavLinkWrapper = ({
  children,
  to,
  prefetch,
}: {
  children: React.ReactNode;
  to: string;
  prefetch?: RemixNavLinkProps["prefetch"];
}) => {
  const defaultClasses = "flex w-full items-center rounded-lg p-2";
  const activeClasses = "bg-indigo-600 text-white";
  const hoverClass = "hover:bg-slate-200";

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? `${defaultClasses} ${activeClasses}`
          : `${defaultClasses} ${hoverClass}`
      }
      prefetch={prefetch}
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

  useEffect(() => {
    containerRef.current?.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex h-screen">
      <aside
        aria-label="Sidebar"
        className="relative h-screen min-w-[300px] border-r bg-gray-100"
      >
        <nav className="h-full">
          <ul className="flex flex-col">
            <li>
              <h1 className="flex items-center pl-[1.2rem] pt-6 pb-8 text-2xl font-bold text-indigo-600">
                <NavLink to="/" className="flex items-end">
                  <AppleLogo className="mr-2" />
                  Musiq Remix
                </NavLink>
              </h1>
            </li>
            <li className="mb-4 px-8">
              <SearchBox />
            </li>
            <li className="px-8">
              <NavLinkWrapper to="/about">
                <MdInfoOutline className="h-5 w-5" />
                <span className="ml-2">About</span>
              </NavLinkWrapper>
            </li>
            <li className="px-8">
              <NavLinkWrapper to="/browse" prefetch="render">
                <HiSquares2X2 className="h-5 w-5" />
                <span className="ml-2">Browse</span>
              </NavLinkWrapper>
            </li>
          </ul>
          <div className="mt-6 h-full">
            {isAuthenticated && (
              <span className="ml-2 px-8 text-[11px] font-bold">
                MY LIBRARY
              </span>
            )}
            <ul className="mt-2 flex h-full flex-col">
              {isAuthenticated && (
                <>
                  <li className="px-8">
                    <NavLinkWrapper to="/library/recently-added">
                      <HiClock className="h-5 w-5" />
                      <span className="ml-2">Recently Added</span>
                    </NavLinkWrapper>
                  </li>
                  <li className="px-8">
                    <NavLinkWrapper to="/library/albums">
                      <IoIosAlbums className="h-5 w-5" />
                      <span className="ml-2">Albums</span>
                    </NavLinkWrapper>
                  </li>
                  <li className="px-8">
                    <NavLinkWrapper to="/library/songs">
                      <IoIosMusicalNote className="h-5 w-5" />
                      <span className="ml-2">Songs</span>
                    </NavLinkWrapper>
                  </li>
                </>
              )}
              <li className="px-8 pt-6">
                <div className="cursor-pointer border-t border-slate-300 px-2 pt-6 hover:text-indigo-600">
                  <button
                    className="flex w-full cursor-pointer items-center space-x-2"
                    onClick={() => window.location.replace("music://")}
                  >
                    <SiApplemusic className="h-6 w-6" />
                    <span className="ml-2">Open in Music</span>
                    <BsBoxArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
              </li>
              <li className="px-8 pt-6">
                <button
                  className="flex w-full items-center px-2 font-bold hover:text-indigo-600"
                  onClick={async () => {
                    if (isAuthenticated) {
                      await appState?.musicKit?.unauthorize();
                      return fetcher.submit(
                        {},
                        { method: "post", action: "/session/deleteSession" }
                      );
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
                  <FaUserCircle className="h-6 w-6" />{" "}
                  <span className="ml-2">
                    {isAuthenticated ? "Sign Out" : "Login"}
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
      <div
        id="mainWrapper"
        className="z-[1] h-auto w-full overflow-auto bg-white"
        ref={containerRef}
      >
        <main className="h-full flex-1">
          <div className="fixed bottom-0 z-[11] h-[65px] w-[calc(100%_-_300px)] bg-gray-100">
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
          {children}
        </main>
      </div>
    </div>
  );
}
