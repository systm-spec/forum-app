import "server-only";

import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db";
import { modPermissions, users } from "@/lib/db/schema";

export type Permission = "deleteCommunities" | "deletePosts" | "deleteComments";
type Role = "admin" | "mod" | "user";
export type Access = { userId: string; role: Role; permissions: Record<Permission, boolean> };

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const noPermissions = { deleteCommunities: false, deletePosts: false, deleteComments: false };
const allPermissions = { deleteCommunities: true, deletePosts: true, deleteComments: true };

export const configuredAdminId = () => {
  const value = process.env.ADMIN_USER_ID;
  return value && uuidPattern.test(value) ? value.toLowerCase() : null;
};

// Jede Prüfung liest Rolle und Mod-Konfiguration frisch; JWTs enthalten nur die Identität.
export const getCurrentAccess = async (): Promise<Access | null> => {
  const sessionUser = await getCurrentUser();
  if (!sessionUser || !uuidPattern.test(sessionUser.id)) return null;
  const [user] = await getDatabase().select({ id: users.id, role: users.role }).from(users).where(eq(users.id, sessionUser.id)).limit(1);
  if (!user) return null;
  if (user.id === configuredAdminId()) return { userId: user.id, role: "admin", permissions: allPermissions };
  if (user.role === "mod") {
    const [settings] = await getDatabase().select().from(modPermissions).where(eq(modPermissions.id, 1)).limit(1);
    return { userId: user.id, role: "mod", permissions: settings ? {
      deleteCommunities: settings.deleteCommunities,
      deletePosts: settings.deletePosts,
      deleteComments: settings.deleteComments,
    } : noPermissions };
  }
  return { userId: user.id, role: "user", permissions: noPermissions };
};

export const can = (access: Access | null, permission: Permission) => Boolean(access?.permissions[permission]);
