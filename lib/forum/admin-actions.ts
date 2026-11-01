"use server";

import { eq } from "drizzle-orm";
import { refresh, revalidatePath } from "next/cache";
import { configuredAdminId, getCurrentAccess, type Permission } from "@/lib/auth/access";
import { getDatabase } from "@/lib/db";
import { modPermissions, users } from "@/lib/db/schema";

type AdminResult = { ok: true; message: string } | { ok: false; message: string };
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const permissionNames: Permission[] = ["deleteCommunities", "deletePosts", "deleteComments"];

export const setUserRole = async (targetId: string, role: "user" | "mod"): Promise<AdminResult> => {
  const access = await getCurrentAccess();
  if (access?.role !== "admin") return { ok: false, message: "Nur Admins dürfen Rollen ändern." };
  if (typeof targetId !== "string" || !uuidPattern.test(targetId) || (role !== "user" && role !== "mod")) {
    return { ok: false, message: "Die Rollenänderung ist ungültig." };
  }
  if (targetId.toLowerCase() === configuredAdminId()) return { ok: false, message: "Der Admin-Account kann nicht herabgestuft werden." };
  try {
    const [updated] = await getDatabase().update(users).set({ role }).where(eq(users.id, targetId)).returning({ id: users.id });
    if (!updated) return { ok: false, message: "Dieses Konto wurde nicht gefunden." };
    revalidatePath("/admin");
    refresh();
    return { ok: true, message: role === "mod" ? "Das Konto ist jetzt Mod." : "Das Konto ist jetzt User." };
  } catch {
    console.error("Rollenänderung fehlgeschlagen.");
    return { ok: false, message: "Die Rollenänderung konnte nicht bestätigt werden. Lade die Seite neu." };
  }
};

export const setModPermission = async (permission: Permission, enabled: boolean): Promise<AdminResult> => {
  const access = await getCurrentAccess();
  if (access?.role !== "admin") return { ok: false, message: "Nur Admins dürfen Mod-Rechte ändern." };
  if (!permissionNames.includes(permission) || typeof enabled !== "boolean") return { ok: false, message: "Die Berechtigung ist ungültig." };
  try {
    const [updated] = await getDatabase().update(modPermissions).set({ [permission]: enabled })
      .where(eq(modPermissions.id, 1)).returning({ id: modPermissions.id });
    if (!updated) return { ok: false, message: "Die Mod-Konfiguration fehlt." };
    revalidatePath("/admin");
    refresh();
    return { ok: true, message: enabled ? "Mod-Recht aktiviert." : "Mod-Recht deaktiviert." };
  } catch {
    console.error("Mod-Berechtigung konnte nicht geändert werden.");
    return { ok: false, message: "Die Änderung konnte nicht bestätigt werden. Lade die Seite neu." };
  }
};
