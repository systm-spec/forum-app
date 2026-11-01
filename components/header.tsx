import Link from "next/link";
import { Suspense } from "react";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { RouteSearch, SearchForm } from "./search-form";

export const Header = () => (
  <header className="site-header">
    <div className="header-inner">
      <Link className="brand" href="/" aria-label="Forum, zum Homefeed">
        <span className="brand-mark" aria-hidden="true">F</span>
        <span>Forum</span>
      </Link>
      <Suspense fallback={<SearchForm action="/" pending />}>
        <RouteSearch />
      </Suspense>
      <button className="login-button" type="button" disabled title="Login ist noch nicht verfügbar" aria-label="Login ist noch nicht verfügbar">
        <HiOutlineUserCircle aria-hidden="true" />
        <span>Login <small>Demnächst</small></span>
      </button>
    </div>
  </header>
);
