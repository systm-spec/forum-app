"use server";

import { and, eq } from "drizzle-orm";
import { refresh, revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import { getDatabase } from "@/lib/db";
import { communities, communityMemberships } from "@/lib/db/schema";

type CommunityInput = { name: string; shortDescription: string; topicBoundary: string; submissionId: string };
type CommunityResult = { ok: true; slug: string } | { ok: false; message: string; loginRequired?: boolean };

const validSubmissionId = (value: unknown): value is string => typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const slugFromName = (name: string) => name.toLowerCase().replace(/ß/g, "ss").normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  .slice(0, 64).replace(/-+$/g, "") || "community";

const candidateSlug = (base: string, index: number) => {
  const suffix = index === 1 ? "" : `-${index}`;
  return `${base.slice(0, 64 - suffix.length).replace(/-+$/g, "")}${suffix}`;
};

export const createCommunity = async (input: CommunityInput): Promise<CommunityResult> => {
  const user = await getCurrentUser();
  if (!user) return { ok: false, loginRequired: true, message: "Bitte melde dich an, um eine Community zu erstellen." };
  if (!input || typeof input.name !== "string" || typeof input.shortDescription !== "string"
    || typeof input.topicBoundary !== "string" || !validSubmissionId(input.submissionId)) {
    return { ok: false, message: "Die Community-Daten sind ungültig." };
  }
  const name = input.name.trim();
  const shortDescription = input.shortDescription.trim();
  const topicBoundary = input.topicBoundary.trim();
  if ([...name].length < 3 || [...name].length > 100) return { ok: false, message: "Der Name muss 3–100 Zeichen enthalten." };
  if ([...shortDescription].length < 10 || [...shortDescription].length > 160) return { ok: false, message: "Die Kurzbeschreibung muss 10–160 Zeichen enthalten." };
  if ([...topicBoundary].length < 10 || [...topicBoundary].length > 1000) return { ok: false, message: "Die Themenabgrenzung muss 10–1.000 Zeichen enthalten." };

  const matches = (saved: { name: string; shortDescription: string; topicBoundary: string | null }) =>
    saved.name === name && saved.shortDescription === shortDescription && saved.topicBoundary === topicBoundary;

  try {
    const result = await getDatabase().transaction(async (tx) => {
      const condition = and(eq(communities.creatorId, user.id), eq(communities.submissionId, input.submissionId));
      const [existing] = await tx.select().from(communities).where(condition).limit(1);
      if (existing) return matches(existing) ? { slug: existing.slug } : { error: "Diese Übermittlung wurde bereits für eine andere Community verwendet." };

      const base = slugFromName(name);
      for (let index = 1; index <= 100; index++) {
        const slug = candidateSlug(base, index);
        const [created] = await tx.insert(communities).values({
          slug, name, description: shortDescription, shortDescription, topicBoundary,
          creatorId: user.id, submissionId: input.submissionId,
        }).onConflictDoNothing().returning({ slug: communities.slug });
        if (created) {
          await tx.insert(communityMemberships).values({ userId: user.id, communitySlug: slug });
          return { slug };
        }
        // Auch bei parallelen Wiederholungen bleibt der erste erfolgreiche Insert maßgeblich.
        const [duplicate] = await tx.select().from(communities).where(condition).limit(1);
        if (duplicate) return matches(duplicate) ? { slug: duplicate.slug } : { error: "Diese Übermittlung wurde bereits für eine andere Community verwendet." };
      }
      return { error: "Für diesen Namen konnte kein freier Community-Link gefunden werden. Wähle einen anderen Namen." };
    });
    if (!result.slug) return { ok: false, message: result.error ?? "Die Community konnte nicht gespeichert werden." };
    revalidatePath("/", "layout");
    refresh();
    return { ok: true, slug: result.slug };
  } catch {
    console.error("Community konnte nicht erstellt werden.");
    return { ok: false, message: "Die Erstellung konnte nicht bestätigt werden. Deine Eingaben bleiben erhalten; versuche dieselbe Übermittlung erneut." };
  }
};
