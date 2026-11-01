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
    <div className="grid min-w-0 max-w-full gap-[3px]">
      <div className="inline-flex items-center justify-self-start overflow-hidden rounded-lg border border-line [&_a:focus-visible]:outline-offset-[-3px] [&_button:focus-visible]:outline-offset-[-3px]" role="group" aria-label="Abstimmung" aria-busy={pending}>
        {canVote ? <button className="grid min-h-8 w-[34px] cursor-pointer place-items-center border-0 bg-transparent p-1.5 text-muted hover:bg-surface-raised hover:text-accent aria-pressed:bg-accent-wash aria-pressed:text-accent disabled:cursor-wait disabled:text-soft focus-visible:outline-offset-[-3px]" type="button" disabled={pending || loginRequired} aria-pressed={ownVote === 1} aria-label={ownVote === 1 ? "Upvote zurücknehmen" : "Upvote"} onClick={() => vote(1)}><HiOutlineArrowUp className="size-[17px]" aria-hidden="true" /></button>
          : <Link className="grid min-h-8 w-[34px] cursor-pointer place-items-center border-0 bg-transparent p-1.5 text-muted hover:bg-surface-raised hover:text-accent focus-visible:outline-offset-[-3px]" href="/login" aria-label="Zum Upvoten einloggen"><HiOutlineArrowUp className="size-[17px]" aria-hidden="true" /></Link>}
        <span className="min-w-6 px-1 text-center text-sm font-semibold" aria-label={`${score} Stimmen`}>{score}</span>
        {canVote ? <button className="grid min-h-8 w-[34px] cursor-pointer place-items-center border-0 bg-transparent p-1.5 text-muted hover:bg-surface-raised hover:text-accent aria-pressed:bg-accent-wash aria-pressed:text-accent disabled:cursor-wait disabled:text-soft focus-visible:outline-offset-[-3px]" type="button" disabled={pending || loginRequired} aria-pressed={ownVote === -1} aria-label={ownVote === -1 ? "Downvote zurücknehmen" : "Downvote"} onClick={() => vote(-1)}><HiOutlineArrowDown className="size-[17px]" aria-hidden="true" /></button>
          : <Link className="grid min-h-8 w-[34px] cursor-pointer place-items-center border-0 bg-transparent p-1.5 text-muted hover:bg-surface-raised hover:text-accent focus-visible:outline-offset-[-3px]" href="/login" aria-label="Zum Downvoten einloggen"><HiOutlineArrowDown className="size-[17px]" aria-hidden="true" /></Link>}
      </div>
      {ownVote !== 0 && <span className="text-xs text-muted">{ownVote === 1 ? "Dein Upvote" : "Dein Downvote"}</span>}
      {pending && <span className="m-0 text-xs text-muted [overflow-wrap:anywhere]" role="status">Stimme wird gespeichert …</span>}
      {error && <p className="m-0 max-w-[48ch] text-sm text-danger [overflow-wrap:anywhere]" role="alert">{error} {loginRequired && <Link className="underline hover:text-accent" href="/login">Einloggen</Link>}</p>}
    </div>
  );
};
