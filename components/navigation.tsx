"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiOutlineHome, HiOutlineSquares2X2 } from "react-icons/hi2";
import { communities } from "@/lib/demo-data";

export const Navigation = () => {
  const pathname = usePathname();

  return (
    <aside className="left-column" aria-label="Seitennavigation">
      <nav aria-label="Hauptnavigation">
        <p className="nav-label">Entdecken</p>
        <Link className={`nav-item ${pathname === "/" ? "active" : ""}`} href="/" aria-current={pathname === "/" ? "page" : undefined}>
          <HiOutlineHome aria-hidden="true" /> Homefeed
        </Link>
        <p className="nav-label community-label">Deine Communitys</p>
        {communities.map((community) => {
          const active = pathname === `/c/${community.slug}` || pathname.startsWith(`/c/${community.slug}/`);
          return (
            <Link className={`nav-item ${active ? "active" : ""}`} href={`/c/${community.slug}`} aria-current={active ? "page" : undefined} key={community.slug}>
              <HiOutlineSquares2X2 aria-hidden="true" /> <span>c/{community.slug}</span>
            </Link>
          );
        })}
      </nav>
      <div className="nav-footer">Ein Platz für gute Gespräche.</div>
    </aside>
  );
};
