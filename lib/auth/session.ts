import "server-only";

import { auth } from "@/auth";
import { connection } from "next/server";

// Absichtlich kein globaler Cache: die Sitzung gehört zur aktuellen Anfrage.
export const getCurrentUser = async () => {
  // Auth.js erzeugt auch ohne Sitzung Zufallswerte. Erst zur echten Anfrage ausführen.
  await connection();
  return (await auth())?.user ?? null;
};
