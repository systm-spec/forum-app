"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition, type FormEvent } from "react";
import { createPost } from "@/lib/forum/actions";
import { postKindHints, postKindLabels } from "@/lib/forum/post-kind";
import type { PostKind } from "@/lib/forum/types";
import { threadPath } from "@/lib/format";

type PostFormProps = { communitySlug: string; communityName: string };

export const PostForm = ({ communitySlug, communityName }: PostFormProps) => {
  const router = useRouter();
  const [kind, setKind] = useState<PostKind>("question");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loginRequired, setLoginRequired] = useState(false);
  const [pending, startTransition] = useTransition();
  const locked = useRef(false);
  const submission = useRef<{ id: string; value: string } | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (locked.current || pending) return;
    locked.current = true;
    setError(null);
    startTransition(async () => {
      try {
        const trimmedTitle = title.trim();
        const trimmedBody = body.trim();
        const value = JSON.stringify([communitySlug, kind, trimmedTitle, trimmedBody]);
        if (!submission.current || submission.current.value !== value) submission.current = { id: crypto.randomUUID(), value };
        const result = await createPost({ communitySlug, kind, title: trimmedTitle, body: trimmedBody, submissionId: submission.current.id });
        if (result.ok) {
          router.replace(threadPath(communitySlug, result.postId));
        } else {
          setError(result.message);
          setLoginRequired(Boolean(result.loginRequired));
        }
      } catch {
        setError("Die Übermittlung konnte nicht bestätigt werden. Deine Eingaben bleiben erhalten; versuche es erneut.");
      } finally {
        locked.current = false;
      }
    });
  };

  return (
    <form className="grid min-w-0 gap-5 rounded-2xl border border-line bg-surface p-6 max-[700px]:p-4" onSubmit={submit} aria-busy={pending}>
      <p className="m-0 text-sm text-muted">Beitrag in <strong className="text-text">{communityName}</strong> · c/{communitySlug}</p>
      <div className="grid gap-2">
        <label className="font-semibold" htmlFor="post-kind">Beitragsart</label>
        <select id="post-kind" value={kind} onChange={(event) => setKind(event.target.value as PostKind)} disabled={pending} aria-describedby="post-kind-hint" className="min-h-11 w-full rounded-lg border border-line bg-bg px-3 py-2 text-text">
          {(Object.keys(postKindLabels) as PostKind[]).map((value) => <option key={value} value={value}>{postKindLabels[value]}</option>)}
        </select>
        <p className="m-0 text-sm text-muted" id="post-kind-hint">{postKindHints[kind]}</p>
      </div>
      <div className="grid gap-2">
        <label className="font-semibold" htmlFor="post-title">Titel</label>
        <input id="post-title" className="min-h-11 w-full min-w-0 rounded-lg border border-line bg-bg px-3 py-2 text-text" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={300} required disabled={pending} aria-describedby="post-title-hint" />
        <p id="post-title-hint" className="m-0 text-sm text-muted">1–300 Zeichen.</p>
      </div>
      <div className="grid gap-2">
        <label className="font-semibold" htmlFor="post-body">Inhalt</label>
        <textarea id="post-body" className="min-h-48 w-full min-w-0 resize-y rounded-lg border border-line bg-bg p-3 text-text" value={body} onChange={(event) => setBody(event.target.value)} maxLength={10000} required disabled={pending} aria-describedby="post-body-hint post-kind-hint" />
        <p id="post-body-hint" className="m-0 text-sm text-muted">1–10.000 Zeichen. Gib genug Kontext für ein gutes Gespräch.</p>
      </div>
      {error && <p className="m-0 text-sm text-danger" role="alert">{error} {loginRequired && <Link className="font-semibold underline" href="/login">Einloggen</Link>}</p>}
      <button className="justify-self-start rounded-lg bg-accent px-4 py-2.5 font-bold text-bg hover:bg-[#a6b2ff] disabled:cursor-wait disabled:bg-accent-wash disabled:text-muted" type="submit" disabled={pending || !title.trim() || !body.trim()}>{pending ? "Wird veröffentlicht …" : "Beitrag veröffentlichen"}</button>
    </form>
  );
};
