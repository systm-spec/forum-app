"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { readQuery } from "@/lib/search";

type SearchFormProps = { action: string; query?: string; pending?: boolean };

export const SearchForm = ({ action, query = "", pending = false }: SearchFormProps) => (
  <form className="flex h-[42px] min-w-0 items-center gap-2.5 rounded-[10px] border border-line bg-surface px-3 text-muted focus-within:border-accent focus-within:shadow-[0_0_0_2px_#8c9dff26] max-[700px]:h-10 max-[700px]:gap-[7px] max-[700px]:px-[9px]" action={action} method="get" role="search" aria-busy={pending}>
    <label className="sr-only" htmlFor="site-search">Beiträge suchen</label>
    <HiOutlineMagnifyingGlass className="size-[19px] flex-none max-[700px]:hidden" aria-hidden="true" />
    <input
      id="site-search"
      name="q"
      type="search"
      defaultValue={query}
      placeholder={pending ? "Suche wird geladen …" : "Beiträge suchen"}
      disabled={pending}
      className="min-w-0 flex-1 border-0 bg-transparent text-text outline-none placeholder:text-muted placeholder:opacity-100 max-[390px]:placeholder:text-[13px]"
    />
    <button className="grid size-7 cursor-pointer place-items-center rounded-md border-0 bg-transparent text-muted hover:text-accent disabled:cursor-wait disabled:text-soft max-[700px]:flex-none" type="submit" aria-label="Suche starten" disabled={pending}>
      <HiOutlineMagnifyingGlass aria-hidden="true" />
    </button>
  </form>
);

export const RouteSearch = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const segments = pathname.split("/");
  const searchPath = segments[1] === "c" && segments[2] ? `/c/${segments[2]}` : "/";
  const values = searchParams.getAll("q");
  const query = readQuery(values.length === 1 ? values[0] : undefined);

  // Das gemeinsame Layout bleibt bei Navigation erhalten; die Eingabe folgt der URL.
  return <SearchForm key={`${pathname}?${searchParams.toString()}`} action={searchPath} query={query} />;
};
