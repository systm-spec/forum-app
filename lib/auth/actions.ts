"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { getDatabase } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { hashPassword } from "./password";
import { validateCredentials, validateRegistration, type AuthFormState } from "./validation";

export const login = async (_previous: AuthFormState, formData: FormData): Promise<AuthFormState> => {
  const result = validateCredentials({ nickname: formData.get("nickname"), password: formData.get("password") });
  if (!result.valid) return result.state;

  try {
    return await signIn("credentials", {
      nickname: result.data.nickname,
      password: result.data.password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        nickname: result.data.nickname,
        message: error.type === "CredentialsSignin"
          ? "Nickname oder Passwort ist falsch."
          : "Die Anmeldung ist gerade nicht möglich. Bitte versuche es später erneut.",
      };
    }
    throw error;
  }
};

export const register = async (_previous: AuthFormState, formData: FormData): Promise<AuthFormState> => {
  const result = validateRegistration({
    nickname: formData.get("nickname"),
    password: formData.get("password"),
    passwordConfirmation: formData.get("passwordConfirmation"),
  });
  if (!result.valid) return result.state;

  try {
    const passwordHash = await hashPassword(result.data.password);
    const created = await getDatabase().insert(users).values({
      nickname: result.data.nickname,
      normalizedNickname: result.data.normalizedNickname,
      passwordHash,
    }).onConflictDoNothing({ target: users.normalizedNickname }).returning({ id: users.id });

    if (!created.length) {
      return { nickname: result.data.nickname, fieldErrors: { nickname: "Dieser Nickname ist bereits vergeben." } };
    }
  } catch {
    console.error("Registrierung fehlgeschlagen.");
    return { nickname: result.data.nickname, message: "Die Registrierung ist gerade nicht möglich. Bitte versuche es später erneut." };
  }

  redirect("/login?registered=1");
};

export const logout = async (): Promise<AuthFormState> => {
  try {
    return await signOut({ redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) return { message: "Abmelden ist gerade nicht möglich. Bitte versuche es erneut." };
    throw error;
  }
};
