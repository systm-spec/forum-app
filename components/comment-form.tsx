"use client";

import Link from "next/link";
import { useId, useRef, useState, useTransition, type FormEvent } from "react";
import { createComment } from "@/lib/forum/actions";

type CommentFormProps = { postId: string; parentId?: string; canComment: boolean };

export const CommentForm = ({ postId, parentId, canComment }: CommentFormProps) => {
  const inputId = useId();
  const [body, setBody] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loginRequired, setLoginRequired] = useState(false);
  const [pending, startTransition] = useTransition();
  const locked = useRef(false);
  const submission = useRef<{ id: string; body: string } | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (locked.current || pending) return;
    locked.current = true;
    setError(null);
    setMessage(null);
    startTransition(async () => {
      try {
        const text = body.trim();
        if (!submission.current || submission.current.body !== text) submission.current = { id: crypto.randomUUID(), body: text };
        const result = await createComment({ postId, parentId: parentId ?? null, body: text, submissionId: submission.current.id });
        if (result.ok) {
          setBody("");
          submission.current = null;
          setMessage(parentId ? "Deine Antwort wurde veröffentlicht." : "Dein Kommentar wurde veröffentlicht.");
        } else {
          setError(result.message);
          setLoginRequired(Boolean(result.loginRequired));
        }
      } catch {
        setError("Die Übermittlung konnte nicht bestätigt werden. Dein Text bleibt erhalten; versuche es erneut.");
      } finally {
        locked.current = false;
      }
    });
  };

  if (!canComment || loginRequired) return <p className="comment-login"><Link className="text-link" href="/login">Einloggen</Link>, um {parentId ? "zu antworten" : "einen Kommentar zu schreiben"}.</p>;

  return (
    <form className="comment-form" onSubmit={submit} aria-busy={pending}>
      <label htmlFor={inputId}>{parentId ? "Deine Antwort" : "Dein Kommentar"}</label>
      <textarea id={inputId} value={body} onChange={(event) => setBody(event.target.value)} rows={parentId ? 3 : 4} maxLength={10000} required disabled={pending} aria-describedby={`${inputId}-hint`} />
      <span id={`${inputId}-hint`} className="field-hint">1–10.000 Zeichen. Bleib respektvoll und beim Thema.</span>
      <button className="primary-link auth-submit" type="submit" disabled={pending || !body.trim()}>{pending ? "Wird veröffentlicht …" : (parentId ? "Antwort veröffentlichen" : "Kommentar veröffentlichen")}</button>
      {error && <p className="mutation-error" role="alert">{error}</p>}
      {message && <p className="mutation-status" role="status">{message}</p>}
    </form>
  );
};
