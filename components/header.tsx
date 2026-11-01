"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiOutlineMagnifyingGlass, HiOutlineUserCircle } from "react-icons/hi2";

export const Header = () => {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const searchPath = segments[1] === "c" && segments[2] ? `/c/${segments[2]}` : "/";

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="Forum, zum Homefeed">
          <span className="brand-mark" aria-hidden="true">F</span>
          <span>Forum</span>
        </Link>
        <form className="search-form" action={searchPath} method="get" role="search">
          <label className="sr-only" htmlFor="site-search">Beiträge suchen</label>
          <HiOutlineMagnifyingGlass aria-hidden="true" />
          <input id="site-search" name="q" type="search" placeholder="Beiträge suchen" />
          <button type="submit" aria-label="Suche starten"><HiOutlineMagnifyingGlass aria-hidden="true" /></button>
        </form>
        <button className="login-button" type="button" disabled title="Login ist noch nicht verfügbar">
          <HiOutlineUserCircle aria-hidden="true" />
          <span>Login <small>Demnächst</small></span>
        </button>
      </div>
    </header>
  );
};
