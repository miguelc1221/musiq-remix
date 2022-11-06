import type { ReactNode } from "react";
import { Link } from "@remix-run/react";
import { AppleLogo } from "../../appleLogo";

export default function Layout({ children }: { children?: ReactNode }) {
  return (
    <div className="flex">
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
              <Link to="/" className="block w-full py-3 px-6">
                Browse
              </Link>
            </li>
            <li className="hover:bg-slate-100">
              <span className="block w-full py-3 px-6">Login</span>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1">
        <div className="min-h-[calc(100%_-_55px)]">{children}</div>
        <div className="sticky bottom-0 h-[55px] bg-slate-100">
          <span>Audio Control</span>
        </div>
      </main>
    </div>
  );
}
