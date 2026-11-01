"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { joinCommunity, leaveCommunity } from "@/lib/forum/actions";

type CommunityMembershipProps = { slug: string; initialMember: boolean };

export const CommunityMembership = ({ slug, initialMember }: CommunityMembershipProps) => {
  const [member, setMember] = useState(initialMember);
  const [error, setError] = useState<string | null>(null);
  const [loginRequired, setLoginRequired] = useState(false);
  const [pending, startTransition] = useTransition();
  const locked = useRef(false);

  const change = () => {
    if (locked.current || pending) return;
    locked.current = true;
    setError(null);
    startTransition(async () => {
      try {
        const result = await (member ? leaveCommunity(slug) : joinCommunity(slug));
        if (result.ok) setMember(!member);
        else {
          setError(result.message);
          setLoginRequired(Boolean(result.loginRequired));
        }
      } catch {
        setError("Der Beitrittsstatus konnte nicht bestätigt werden. Lade die Seite neu und versuche es erneut.");
      } finally {
        locked.current = false;
      }
    });
  };

  return (
    <div className="grid justify-items-start gap-2">
      <button type="button" onClick={change} disabled={pending} aria-busy={pending} className="rounded-lg border border-accent px-4 py-2 font-semibold text-accent hover:bg-accent-wash disabled:cursor-wait disabled:opacity-60">{pending ? "Wird aktualisiert …" : member ? "Community verlassen" : "Beitreten"}</button>
      <p className="m-0 text-sm text-muted" role="status">{member ? "Du bist Mitglied dieser Community." : "Du bist dieser Community nicht beigetreten."}</p>
      {error && <p className="m-0 text-sm text-danger" role="alert">{error} {loginRequired && <Link href="/login" className="font-semibold underline">Einloggen</Link>}</p>}
    </div>
  );
};
