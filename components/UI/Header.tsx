import Link from "next/link";
import { Suspense } from "react";
import { AccountControls, AccountFallback } from "../auth/AccountControls";
import { RouteSearch, SearchForm } from "../SearchForm";

export const Header = () => (
  <header className="fixed z-30 inset-x-0 top-0 h-[76px] border-b border-line bg-[rgba(24,27,35,.96)] backdrop-blur-[14px] max-[700px]:h-[68px]">
    <div className="mx-auto grid h-full w-[calc(100%_-_48px)] max-w-[1480px] grid-cols-[minmax(180px,1fr)_minmax(240px,560px)_minmax(120px,1fr)] items-center gap-6 max-[1100px]:grid-cols-[minmax(150px,1fr)_minmax(210px,500px)_auto] max-[700px]:w-[calc(100%_-_28px)] max-[700px]:max-w-[560px] max-[700px]:grid-cols-[auto_minmax(0,1fr)_auto] max-[700px]:gap-[11px] max-[390px]:w-[calc(100%_-_20px)] max-[390px]:gap-[7px]">
      <Link className="inline-flex w-max items-center gap-[11px] text-[25px] font-bold tracking-[-.045em] hover:text-accent max-[700px]:gap-0 max-[700px]:text-[0px]" href="/" aria-label="Forum, zum Homefeed">
        <span className="grid size-[34px] place-items-center rounded-[10px] border border-[#5b679b] bg-accent-wash text-[22px] leading-none text-accent max-[700px]:size-8 max-[700px]:text-xl" aria-hidden="true">F</span>
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
