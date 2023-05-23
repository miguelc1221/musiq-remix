import type { ReactNode } from "react";
import clsx from "clsx";
import { useRef, useCallback, useState } from "react";
import { useEffect } from "react";
import { NavLink, useLocation, useFetcher } from "@remix-run/react";
import {
  AppleLogo,
  AboutIcon,
  AppleMusicLogo,
  BrowseIcon,
  LibAlbumsIcon,
  LibSongsIcon,
  LibRecentlyIcon,
  UserIcon,
  HamburgerMenuIcon,
  CloseIcon,
  BoxArrowUpRightIcon,
} from "../icons";
import { TrackDisplay } from "../trackDisplay/trackDisplay";
import type { AppContextType } from "~/appReducer";
import { SearchBox } from "~/routes/search";
import type { RemixNavLinkProps } from "@remix-run/react/dist/components";

const NavLinkWrapper = ({
  children,
  to,
  prefetch,
  onClick,
}: {
  children: React.ReactNode;
  to: string;
  onClick?: () => void;
  prefetch?: RemixNavLinkProps["prefetch"];
}) => {
  const defaultClasses = "flex w-full items-center rounded-lg p-2";
  const activeClasses = "bg-indigo-600 text-white";
  const hoverClass = "hover:bg-slate-200";

  return (
    <NavLink
      onClick={onClick}
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
  isMobile = false,
}: {
  appState?: AppContextType;
  isAuthenticated?: boolean;
  children?: ReactNode;
  isMobile?: boolean;
}) {
  const [isOpen, toggleOpen] = useState(false);
  const fetcher = useFetcher();
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const closeToggle = useCallback(() => toggleOpen(false), []);

  const authenticateUser = useCallback(async () => {
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
  }, [appState?.musicKit, fetcher]);

  useEffect(() => {
    containerRef.current?.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex h-screen">
      <aside
        aria-label="Sidebar"
        className={clsx(
          "relative h-screen min-w-[300px] border-r bg-gray-100 transition-all md:absolute md:z-10 md:w-full md:overflow-hidden md:duration-300 md:ease-in",
          {
            "md:h-[45px]": !isOpen,
          }
        )}
      >
        <div className=" hidden h-[42px] w-full items-center justify-end md:flex">
          <HamburgerMenuIcon
            className={clsx("z-20 mr-6 h-6 w-6 cursor-pointer", {
              hidden: isOpen,
            })}
            onClick={() => toggleOpen(!isOpen)}
          />
          <CloseIcon
            className={clsx("z-20 mr-6 h-6 w-6 cursor-pointer", {
              hidden: !isOpen,
            })}
            onClick={() => toggleOpen(!isOpen)}
          />
        </div>
        <nav className="h-full">
          <ul className="flex flex-col">
            <li>
              <h1 className="flex items-center pl-[1.2rem] pt-6 pb-8 text-2xl font-bold text-indigo-600 md:pt-0">
                <NavLink
                  to="/"
                  className="flex items-end"
                  onClick={closeToggle}
                >
                  <AppleLogo className="mr-2" />
                  Musiq Remix
                </NavLink>
              </h1>
            </li>
            <li className="mb-4 px-8">
              <SearchBox />
            </li>
            <li className="px-8">
              <NavLinkWrapper to="/" onClick={closeToggle}>
                <AboutIcon className="h-5 w-5" />
                <span className="ml-2">About</span>
              </NavLinkWrapper>
            </li>
            <li className="px-8">
              <NavLinkWrapper
                to="/browse"
                prefetch="render"
                onClick={closeToggle}
              >
                <BrowseIcon className="h-5 w-5" />
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
                    <NavLinkWrapper
                      to="/library/recently-added"
                      onClick={closeToggle}
                    >
                      <LibRecentlyIcon className="h-5 w-5" />
                      <span className="ml-2">Recently Added</span>
                    </NavLinkWrapper>
                  </li>
                  <li className="px-8">
                    <NavLinkWrapper to="/library/albums" onClick={closeToggle}>
                      <LibAlbumsIcon className="h-5 w-5" />
                      <span className="ml-2">Albums</span>
                    </NavLinkWrapper>
                  </li>
                  <li className="px-8">
                    <NavLinkWrapper to="/library/songs" onClick={closeToggle}>
                      <LibSongsIcon className="h-5 w-5" />
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
                    <AppleMusicLogo className="h-6 w-6" />
                    <span className="ml-2">Open in Music</span>
                    <BoxArrowUpRightIcon className="h-3 w-3" />
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

                    await authenticateUser();
                  }}
                >
                  <UserIcon className="h-6 w-6" />{" "}
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
        className="z-[1] w-full overflow-auto bg-white supports-[max-height:100cqh]:max-h-[100cqh] supports-[max-height:100svh]:max-h-[100svh]"
        ref={containerRef}
      >
        <main className="h-full flex-1">
          <div className="fixed bottom-0 z-[11] h-[65px] w-[calc(100%_-_300px)] bg-gray-100 md:w-full lg:h-[92px]">
            <div
              tabIndex={-1}
              className="grid h-full grid-cols-[1fr_2fr_1fr] items-center lg:block"
            >
              <TrackDisplay
                player={appState?.player}
                musicKit={appState?.musicKit}
                requireAuth={isAuthenticated ? undefined : authenticateUser}
                isMobile
              />
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
