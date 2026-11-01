"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition, type FormEvent } from "react";
import { createCommunity } from "@/lib/forum/community-actions";

export const CommunityForm = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [topicBoundary, setTopicBoundary] = useState("");
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
        const trimmedName = name.trim();
        const trimmedDescription = shortDescription.trim();
        const trimmedBoundary = topicBoundary.trim();
        const value = JSON.stringify([trimmedName, trimmedDescription, trimmedBoundary]);
        if (!submission.current || submission.current.value !== value) submission.current = { id: crypto.randomUUID(), value };
        const result = await createCommunity({ name: trimmedName, shortDescription: trimmedDescription, topicBoundary: trimmedBoundary, submissionId: submission.current.id });
        if (result.ok) router.replace(`/c/${result.slug}`);
        else {
          setError(result.message);
          setLoginRequired(Boolean(result.loginRequired));
        }
      } catch {
        setError("Die Erstellung konnte nicht bestätigt werden. Deine Eingaben bleiben erhalten; versuche es erneut.");
      } finally {
        locked.current = false;
      }
    });
  };

  return (
    <form className="grid min-w-0 gap-5 rounded-2xl border border-line bg-surface p-6 max-[700px]:p-4" onSubmit={submit} aria-busy={pending}>
      <div className="grid gap-2">
        <label className="font-semibold" htmlFor="community-name">Name</label>
        <input id="community-name" className="min-h-11 w-full min-w-0 rounded-lg border border-line bg-bg px-3 py-2 text-text" value={name} onChange={(event) => setName(event.target.value)} minLength={3} maxLength={100} required disabled={pending} aria-describedby="community-name-hint" />
        <p id="community-name-hint" className="m-0 text-sm text-muted">3–100 Zeichen. Benenne das Thema klar, zum Beispiel „Kapitalismus vs. Sozialismus“.</p>
      </div>
      <div className="grid gap-2">
        <label className="font-semibold" htmlFor="community-description">Kurzbeschreibung: Worum geht es?</label>
        <textarea id="community-description" className="min-h-24 w-full min-w-0 resize-y rounded-lg border border-line bg-bg p-3 text-text" value={shortDescription} onChange={(event) => setShortDescription(event.target.value)} minLength={10} maxLength={160} required disabled={pending} aria-describedby="community-description-hint" />
        <p id="community-description-hint" className="m-0 text-sm text-muted">10–160 Zeichen. Beschreibe den gemeinsamen Gesprächsgegenstand, ohne eine Position vorzugeben.</p>
      </div>
      <div className="grid gap-2">
        <label className="font-semibold" htmlFor="community-boundary">Themenabgrenzung</label>
        <textarea id="community-boundary" className="min-h-40 w-full min-w-0 resize-y rounded-lg border border-line bg-bg p-3 text-text" value={topicBoundary} onChange={(event) => setTopicBoundary(event.target.value)} minLength={10} maxLength={1000} required disabled={pending} aria-describedby="community-boundary-hint" />
        <p id="community-boundary-hint" className="m-0 text-sm text-muted">10–1.000 Zeichen. Welche Fragen gehören hierher, welche liegen außerhalb?</p>
      </div>
      <p className="m-0 text-sm text-muted">Für jede Community gelten die allgemeinen Forumsregeln.</p>
      {error && <p className="m-0 text-sm text-danger" role="alert">{error} {loginRequired && <Link className="font-semibold underline" href="/login">Einloggen</Link>}</p>}
      <button className="justify-self-start rounded-lg bg-accent px-4 py-2.5 font-bold text-bg hover:bg-[#a6b2ff] disabled:cursor-wait disabled:bg-accent-wash disabled:text-muted" type="submit" disabled={pending || !name.trim() || !shortDescription.trim() || !topicBoundary.trim()}>{pending ? "Wird erstellt …" : "Community erstellen"}</button>
    </form>
  );
};
