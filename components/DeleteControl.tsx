"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { deleteComment, deleteCommunity, deletePost } from "@/lib/forum/delete-actions";

type DeleteTarget = { type: "community"; id: string } | { type: "post"; id: string } | { type: "comment"; id: string };
type DeleteControlProps = { target: DeleteTarget };

const copy = {
  community: { label: "Community löschen", explanation: "Diese Community und alle zugehörigen Beiträge, Kommentare, Stimmen und Mitgliedschaften werden dauerhaft entfernt. Nutzerkonten bleiben erhalten." },
  post: { label: "Beitrag löschen", explanation: "Dieser Beitrag und sein gesamter Gesprächsfaden mit Kommentaren und Stimmen werden dauerhaft entfernt." },
  comment: { label: "Kommentar löschen", explanation: "Der Kommentar wird durch einen neutralen Platzhalter ersetzt. Antworten bleiben erhalten; seine Stimmen werden entfernt." },
};

export const DeleteControl = ({ target }: DeleteControlProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginRequired, setLoginRequired] = useState(false);
  const [pending, startTransition] = useTransition();
  const locked = useRef(false);
  const { label, explanation } = copy[target.type];

  const remove = () => {
    if (locked.current || pending) return;
    locked.current = true;
    setError(null);
    startTransition(async () => {
      try {
        const result = target.type === "community" ? await deleteCommunity(target.id)
          : target.type === "post" ? await deletePost(target.id) : await deleteComment(target.id);
        if (result.ok) {
          if (result.redirectTo) router.replace(result.redirectTo);
          else router.refresh();
        } else {
          setError(result.message);
          setLoginRequired(Boolean(result.loginRequired));
        }
      } catch {
        setError("Die Löschung konnte nicht bestätigt werden. Lade die Seite neu, bevor du es erneut versuchst.");
      } finally { locked.current = false; }
    });
  };

  return <div className="min-w-0">
    {!open ? <button type="button" onClick={() => setOpen(true)} className="rounded-lg border border-line px-3 py-2 text-sm font-semibold text-danger hover:border-danger">{label}</button> :
      <div className="grid max-w-[60ch] gap-3 rounded-lg border border-line bg-bg p-4" role="group" aria-label={`${label} bestätigen`}>
        <p className="m-0 text-sm text-muted">{explanation}</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={remove} disabled={pending} aria-busy={pending} className="rounded-lg border border-danger px-3 py-2 text-sm font-bold text-danger hover:bg-surface-raised disabled:cursor-wait disabled:opacity-60">{pending ? "Wird gelöscht …" : "Ja, dauerhaft löschen"}</button>
          <button type="button" onClick={() => { setOpen(false); setError(null); }} disabled={pending} className="rounded-lg border border-line px-3 py-2 text-sm text-muted hover:text-text disabled:opacity-60">Abbrechen</button>
        </div>
      </div>}
    {error && <p className="mt-2 mb-0 text-sm text-danger" role="alert">{error} {loginRequired && <Link href="/login" className="font-semibold underline">Einloggen</Link>}</p>}
  </div>;
};
