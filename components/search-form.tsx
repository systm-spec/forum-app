"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { readQuery } from "@/lib/search";

type SearchFormProps = { action: string; query?: string; pending?: boolean };

export const SearchForm = ({ action, query = "", pending = false }: SearchFormProps) => (
  <form className="search-form" action={action} method="get" role="search" aria-busy={pending}>
    <label className="sr-only" htmlFor="site-search">Beiträge suchen</label>
    <HiOutlineMagnifyingGlass aria-hidden="true" />
    <input
      id="site-search"
      name="q"
      type="search"
      defaultValue={query}
      placeholder={pending ? "Suche wird geladen …" : "Beiträge suchen"}
      disabled={pending}
    />
    <button type="submit" aria-label="Suche starten" disabled={pending}>
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
