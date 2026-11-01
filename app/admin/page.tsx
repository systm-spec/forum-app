import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PermissionControl, RoleControl } from "@/components/AdminControls";
import { InfoPanel } from "@/components/UI/InfoPanel";
import { getCurrentAccess } from "@/lib/auth/access";
import { getDatabase } from "@/lib/db";
import { modPermissions, users } from "@/lib/db/schema";

type AdminPageProps = { searchParams: Promise<{ q?: string | string[] }> };

const AdminContent = async ({ searchParams }: AdminPageProps) => {
  const access = await getCurrentAccess();
  if (access?.role !== "admin") notFound();
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const validQuery = /^[A-Za-z][A-Za-z0-9_]{2,23}$/.test(query);
  const [settings] = await getDatabase().select().from(modPermissions).where(eq(modPermissions.id, 1)).limit(1);
  const [found] = validQuery ? await getDatabase().select({ id: users.id, nickname: users.nickname, role: users.role })
    .from(users).where(eq(users.normalizedNickname, query.toLowerCase())).limit(1) : [];

  return <>
    <main id="main-content" className="min-w-0 scroll-mt-[94px] max-[700px]:order-1 max-[700px]:w-full max-[700px]:scroll-mt-[86px]">
      <h1 className="mb-2 text-[clamp(28px,4vw,38px)] leading-tight">Admin-Panel</h1>
      <p className="mb-6 text-muted">Rollen und globale Mod-Rechte verwalten.</p>
      <section className="mb-6 rounded-2xl border border-line bg-surface p-6 max-[700px]:p-4" aria-labelledby="admin-users-title">
        <h2 id="admin-users-title" className="mt-0 mb-4 text-xl">Nutzer finden</h2>
        <form action="/admin" method="get" className="flex min-w-0 flex-wrap items-end gap-3">
          <div className="grid min-w-0 flex-[1_1_200px] gap-2"><label htmlFor="admin-user-query" className="font-semibold">Nickname</label><input id="admin-user-query" name="q" defaultValue={query} minLength={3} maxLength={24} required className="min-h-11 w-full min-w-0 rounded-lg border border-line bg-bg px-3 py-2 text-text" /></div>
          <button type="submit" className="min-h-11 rounded-lg bg-accent px-4 py-2 font-bold text-bg hover:bg-[#a6b2ff]">Suchen</button>
        </form>
        {query && !validQuery && <p className="mt-4 mb-0 text-sm text-danger" role="alert">Gib einen gültigen Nickname mit 3–24 Zeichen ein.</p>}
        {validQuery && !found && <p className="mt-4 mb-0 text-sm text-muted">Kein Konto mit diesem Nickname gefunden.</p>}
        {found && <div className="mt-5 grid gap-2 border-t border-line pt-4"><p className="m-0 font-semibold">u/{found.nickname} · {found.id === access.userId ? "Admin" : found.role === "mod" ? "Mod" : "User"}</p>{found.id === access.userId ? <p className="m-0 text-sm text-muted">Der Admin-Account kann hier nicht herabgestuft werden.</p> : <RoleControl key={found.id} userId={found.id} initialRole={found.role} />}</div>}
      </section>
      <section className="rounded-2xl border border-line bg-surface p-6 max-[700px]:p-4" aria-labelledby="admin-permissions-title">
        <h2 id="admin-permissions-title" className="mt-0 mb-1 text-xl">Mod-Berechtigungen</h2>
        <p className="mb-4 text-sm text-muted">Diese Rechte gelten für alle Mods. Admins haben sie immer.</p>
        {settings ? <>
          <PermissionControl permission="deleteCommunities" label="Communitys löschen" initialEnabled={settings.deleteCommunities} />
          <PermissionControl permission="deletePosts" label="Beiträge/Subs löschen" initialEnabled={settings.deletePosts} />
          <PermissionControl permission="deleteComments" label="Kommentare löschen" initialEnabled={settings.deleteComments} />
        </> : <p className="text-danger" role="alert">Die Mod-Konfiguration fehlt.</p>}
      </section>
    </main>
    <aside className="sticky top-[110px] min-w-0 max-[1100px]:static max-[1100px]:col-start-2 max-[1100px]:row-start-2 max-[700px]:order-2 max-[700px]:w-full" aria-label="Zum Admin-Panel">
      <InfoPanel eyebrow="Berechtigungen" title="Globale Rollen"><p className="m-0 text-sm text-muted">Nur dieses Admin-Konto kann Rollen und Mod-Rechte ändern. Community-Erstellung und Beitritt vergeben keine Moderationsrechte.</p></InfoPanel>
    </aside>
  </>;
};

const AdminPage = ({ searchParams }: AdminPageProps) => (
  <Suspense fallback={<main id="main-content" className="min-w-0 max-[700px]:order-1"><p className="rounded-2xl border border-line bg-surface p-6 text-muted" role="status">Admin-Panel wird geladen …</p></main>}><AdminContent searchParams={searchParams} /></Suspense>
);

export default AdminPage;
