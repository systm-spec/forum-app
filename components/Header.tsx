import Link from "next/link";
import { Suspense } from "react";
import { AccountControls, AccountFallback } from "./auth/AccountControls";
import { RouteSearch, SearchForm } from "./SearchForm";

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
      <Suspense fallback={<AccountFallback />}>
        <AccountControls />
      </Suspense>
    </div>
  </header>
);
