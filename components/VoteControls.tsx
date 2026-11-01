"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineArrowDown, HiOutlineArrowUp } from "react-icons/hi2";
import { toggleVote } from "@/lib/forum/actions";
import type { VoteTarget, VoteValue } from "@/lib/forum/types";

type VoteControlsProps = { target: VoteTarget; score: number; ownVote: VoteValue; canVote: boolean };

export const VoteControls = ({ target, score, ownVote, canVote }: VoteControlsProps) => {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [loginRequired, setLoginRequired] = useState(false);
  const locked = useRef(false);
  const router = useRouter();

  const vote = (direction: -1 | 1) => {
    if (locked.current || pending) return;
    locked.current = true;
    setError(null);
    startTransition(async () => {
      try {
        const result = await toggleVote(target, direction);
        if (!result.ok) {
          setError(result.message);
          setLoginRequired(Boolean(result.loginRequired));
          router.refresh();
        }
      } catch {
        setError("Die Stimme konnte nicht bestätigt werden. Der aktuelle Stand wird neu geladen.");
        router.refresh();
      } finally {
        locked.current = false;
      }
    });
  };

  return (
    <div className="vote-control">
      <div className="vote-buttons" role="group" aria-label="Abstimmung" aria-busy={pending}>
        {canVote ? <button type="button" disabled={pending || loginRequired} aria-pressed={ownVote === 1} aria-label={ownVote === 1 ? "Upvote zurücknehmen" : "Upvote"} onClick={() => vote(1)}><HiOutlineArrowUp aria-hidden="true" /></button>
          : <Link href="/login" aria-label="Zum Upvoten einloggen"><HiOutlineArrowUp aria-hidden="true" /></Link>}
        <span className="vote-score" aria-label={`${score} Stimmen`}>{score}</span>
        {canVote ? <button type="button" disabled={pending || loginRequired} aria-pressed={ownVote === -1} aria-label={ownVote === -1 ? "Downvote zurücknehmen" : "Downvote"} onClick={() => vote(-1)}><HiOutlineArrowDown aria-hidden="true" /></button>
          : <Link href="/login" aria-label="Zum Downvoten einloggen"><HiOutlineArrowDown aria-hidden="true" /></Link>}
      </div>
      {ownVote !== 0 && <span className="vote-own-status">{ownVote === 1 ? "Dein Upvote" : "Dein Downvote"}</span>}
      {pending && <span className="mutation-status" role="status">Stimme wird gespeichert …</span>}
      {error && <p className="mutation-error" role="alert">{error} {loginRequired && <Link href="/login">Einloggen</Link>}</p>}
    </div>
  );
};
