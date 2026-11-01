"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiOutlineHome, HiOutlinePlusCircle, HiOutlineShieldCheck, HiOutlineSquares2X2 } from "react-icons/hi2";

type NavigationLinksProps = { pathname?: string; communities: { slug: string; name: string }[]; isAdmin: boolean };

export const NavigationLinks = ({ pathname, communities, isAdmin }: NavigationLinksProps) => (
  <>
    <p className="mx-3 mt-0 mb-[9px] text-xs font-bold tracking-[.09em] text-soft uppercase max-[700px]:hidden">Entdecken</p>
    <Link className="flex min-w-0 items-center gap-3 rounded-[9px] px-[13px] py-2.5 font-semibold text-muted hover:bg-surface hover:text-accent aria-[current=page]:bg-accent-wash aria-[current=page]:text-accent max-[700px]:flex-none max-[700px]:border max-[700px]:border-line max-[700px]:bg-surface max-[700px]:aria-[current=page]:bg-accent-wash max-[700px]:px-2.5 max-[700px]:py-2 max-[700px]:text-[13px]" href="/" aria-current={pathname === "/" ? "page" : undefined}>
      <HiOutlineHome className="size-[19px] flex-none max-[700px]:size-4" aria-hidden="true" /> Homefeed
    </Link>
    <Link className="flex min-w-0 items-center gap-3 rounded-[9px] px-[13px] py-2.5 font-semibold text-muted hover:bg-surface hover:text-accent aria-[current=page]:bg-accent-wash aria-[current=page]:text-accent max-[700px]:flex-none max-[700px]:border max-[700px]:border-line max-[700px]:bg-surface max-[700px]:aria-[current=page]:bg-accent-wash max-[700px]:px-2.5 max-[700px]:py-2 max-[700px]:text-[13px]" href="/communities/new" aria-current={pathname === "/communities/new" ? "page" : undefined}>
      <HiOutlinePlusCircle className="size-[19px] flex-none max-[700px]:size-4" aria-hidden="true" /> Community erstellen
    </Link>
    {isAdmin && <Link className="flex min-w-0 items-center gap-3 rounded-[9px] px-[13px] py-2.5 font-semibold text-muted hover:bg-surface hover:text-accent aria-[current=page]:bg-accent-wash aria-[current=page]:text-accent max-[700px]:flex-none max-[700px]:border max-[700px]:border-line max-[700px]:bg-surface max-[700px]:aria-[current=page]:bg-accent-wash max-[700px]:px-2.5 max-[700px]:py-2 max-[700px]:text-[13px]" href="/admin" aria-current={pathname === "/admin" ? "page" : undefined}><HiOutlineShieldCheck className="size-[19px] flex-none max-[700px]:size-4" aria-hidden="true" /> Admin-Panel</Link>}
    <p className="mx-3 mt-7 mb-[9px] text-xs font-bold tracking-[.09em] text-soft uppercase max-[700px]:hidden">Communitys entdecken</p>
    {communities.map((community) => {
      const active = pathname === `/c/${community.slug}` || pathname?.startsWith(`/c/${community.slug}/`);
      return (
        <Link className="flex min-w-0 items-center gap-3 rounded-[9px] px-[13px] py-2.5 font-semibold text-muted hover:bg-surface hover:text-accent aria-[current=page]:bg-accent-wash aria-[current=page]:text-accent max-[700px]:flex-none max-[700px]:border max-[700px]:border-line max-[700px]:bg-surface max-[700px]:aria-[current=page]:bg-accent-wash max-[700px]:px-2.5 max-[700px]:py-2 max-[700px]:text-[13px]" href={`/c/${community.slug}`} aria-current={active ? "page" : undefined} key={community.slug}>
          <HiOutlineSquares2X2 className="size-[19px] flex-none max-[700px]:size-4" aria-hidden="true" /> <span className="[overflow-wrap:anywhere]" title={community.name}>c/{community.slug}</span>
        </Link>
      );
    })}
  </>
);

export const ActiveNavigationLinks = ({ communities, isAdmin }: Pick<NavigationLinksProps, "communities" | "isAdmin">) => {
  const pathname = usePathname();
  return <NavigationLinks pathname={pathname} communities={communities} isAdmin={isAdmin} />;
};
