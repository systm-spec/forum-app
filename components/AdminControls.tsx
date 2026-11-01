"use client";

import { useRef, useState, useTransition } from "react";
import { setModPermission, setUserRole } from "@/lib/forum/admin-actions";
import type { Permission } from "@/lib/auth/access";

type RoleControlProps = { userId: string; initialRole: "user" | "mod" };
type PermissionControlProps = { permission: Permission; label: string; initialEnabled: boolean };

export const RoleControl = ({ userId, initialRole }: RoleControlProps) => {
  const [role, setRole] = useState(initialRole);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const locked = useRef(false);

  const change = () => {
    if (locked.current || pending) return;
    locked.current = true;
    setError(null);
    setMessage(null);
    const nextRole = role === "user" ? "mod" : "user";
    startTransition(async () => {
      try {
        const result = await setUserRole(userId, nextRole);
        if (result.ok) { setRole(nextRole); setMessage(result.message); }
        else setError(result.message);
      } catch { setError("Die Rollenänderung konnte nicht bestätigt werden. Lade die Seite neu."); }
      finally { locked.current = false; }
    });
  };

  return <div className="grid justify-items-start gap-2">
    <button type="button" onClick={change} disabled={pending} aria-busy={pending} className="rounded-lg border border-accent px-4 py-2 font-semibold text-accent hover:bg-accent-wash disabled:cursor-wait disabled:opacity-60">{pending ? "Wird gespeichert …" : role === "user" ? "Zu Mod ernennen" : "Zu User machen"}</button>
    {message && <p className="m-0 text-sm text-muted" role="status">{message}</p>}
    {error && <p className="m-0 text-sm text-danger" role="alert">{error}</p>}
  </div>;
};

export const PermissionControl = ({ permission, label, initialEnabled }: PermissionControlProps) => {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const locked = useRef(false);

  const change = () => {
    if (locked.current || pending) return;
    locked.current = true;
    setError(null);
    setMessage(null);
    startTransition(async () => {
      try {
        const result = await setModPermission(permission, !enabled);
        if (result.ok) { setEnabled(!enabled); setMessage(result.message); }
        else setError(result.message);
      } catch { setError("Die Änderung konnte nicht bestätigt werden. Lade die Seite neu."); }
      finally { locked.current = false; }
    });
  };

  return <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line py-3">
    <div><p className="m-0 font-semibold">{label}</p><p className="m-0 text-sm text-muted" role="status">{enabled ? "Aktiv für Mods" : "Deaktiviert für Mods"}</p></div>
    <button type="button" onClick={change} disabled={pending} aria-busy={pending} aria-label={`${label} für Mods ${enabled ? "deaktivieren" : "aktivieren"}`} className="rounded-lg border border-accent px-3 py-2 text-sm font-semibold text-accent hover:bg-accent-wash disabled:cursor-wait disabled:opacity-60">{pending ? "Speichert …" : enabled ? "Deaktivieren" : "Aktivieren"}</button>
    {(message || error) && <p className={`m-0 w-full text-sm ${error ? "text-danger" : "text-muted"}`} role={error ? "alert" : "status"}>{error ?? message}</p>}
  </div>;
};
