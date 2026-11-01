import "server-only";

import { eq } from "drizzle-orm";
import NextAuth, { AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getDatabase } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { validateCredentials } from "@/lib/auth/validation";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  pages: { signIn: "/login" },
  providers: [Credentials({
    credentials: {
      nickname: { label: "Nickname", type: "text" },
      password: { label: "Passwort", type: "password" },
    },
    authorize: async (credentials) => {
      const result = validateCredentials(credentials);
      if (!result.valid) return null;

      const [user] = await getDatabase().select({
        id: users.id,
        nickname: users.nickname,
        passwordHash: users.passwordHash,
      }).from(users).where(eq(users.normalizedNickname, result.data.normalizedNickname)).limit(1);

      const matches = await verifyPassword(user?.passwordHash, result.data.password);
      return user && matches ? { id: user.id, nickname: user.nickname } : null;
    },
  })],
  callbacks: {
    jwt: async ({ token, user }) => {
      // Nur Identität und Anzeigename übernehmen; keine Credentials oder Hashes.
      if (user) return { sub: user.id, nickname: user.nickname };
      return token;
    },
    session: async ({ session, token }) => {
      if (!token.sub || typeof token.nickname !== "string") {
        throw new Error("Ungültige Sitzung.");
      }
      return { expires: session.expires, user: { id: token.sub, nickname: token.nickname } };
    },
  },
  logger: {
    // Fehlerdetails aus Treibern können Konfiguration oder SQL-Parameter enthalten.
    error: (error) => console.error(`[auth] ${error instanceof AuthError ? error.type : "AuthError"}`),
  },
});
