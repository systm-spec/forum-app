"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, register } from "@/lib/auth/actions";
import type { AuthFormState } from "@/lib/auth/validation";

type AuthFormProps = { mode: "login" | "register" };
const initialState: AuthFormState = {};

export const AuthForm = ({ mode }: AuthFormProps) => {
  const registering = mode === "register";
  const [state, action, pending] = useActionState(registering ? register : login, initialState);
  const errors = state.fieldErrors;

  return (
    <form className="grid gap-6" action={action} aria-busy={pending}>
      {state.message && <p className="mb-0 rounded-lg border border-current p-3 text-[15px] text-danger [overflow-wrap:anywhere]" role="alert">{state.message}</p>}
      <div className="grid gap-2">
        <label className="font-semibold" htmlFor="nickname">Nickname</label>
        <input
          className="w-full min-w-0 rounded-lg border border-line bg-bg px-3 py-2.5 text-text aria-invalid:border-danger"
          id="nickname"
          name="nickname"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          minLength={3}
          maxLength={24}
          pattern="[A-Za-z][A-Za-z0-9_]{2,23}"
          defaultValue={state.nickname ?? ""}
          required
          aria-invalid={Boolean(errors?.nickname)}
          aria-describedby={errors?.nickname ? "nickname-error nickname-hint" : "nickname-hint"}
        />
        <p id="nickname-hint" className="m-0 text-sm text-muted">3–24 Zeichen: A–Z, Zahlen und Unterstriche. Beginne mit einem Buchstaben. Groß- und Kleinschreibung unterscheiden keine Konten.</p>
        {errors?.nickname && <p id="nickname-error" className="m-0 text-sm text-danger" role="alert">{errors.nickname}</p>}
      </div>
      <div className="grid gap-2">
        <label className="font-semibold" htmlFor="password">Passwort</label>
        <input
          className="w-full min-w-0 rounded-lg border border-line bg-bg px-3 py-2.5 text-text aria-invalid:border-danger"
          id="password"
          name="password"
          type="password"
          autoComplete={registering ? "new-password" : "current-password"}
          minLength={5}
          maxLength={128}
          required
          aria-invalid={Boolean(errors?.password)}
          aria-describedby={errors?.password ? "password-error password-hint" : "password-hint"}
        />
        <p id="password-hint" className="m-0 text-sm text-muted">12–128 Zeichen. Leerzeichen sind erlaubt.</p>
        {errors?.password && <p id="password-error" className="m-0 text-sm text-danger" role="alert">{errors.password}</p>}
      </div>
      {registering && (
        <div className="grid gap-2">
          <label className="font-semibold" htmlFor="password-confirmation">Passwort bestätigen</label>
          <input
            className="w-full min-w-0 rounded-lg border border-line bg-bg px-3 py-2.5 text-text aria-invalid:border-danger"
            id="password-confirmation"
            name="passwordConfirmation"
            type="password"
            autoComplete="new-password"
            minLength={5}
            maxLength={128}
            required
            aria-invalid={Boolean(errors?.passwordConfirmation)}
            aria-describedby={errors?.passwordConfirmation ? "password-confirmation-error" : undefined}
          />
          {errors?.passwordConfirmation && <p id="password-confirmation-error" className="m-0 text-sm text-danger" role="alert">{errors.passwordConfirmation}</p>}
        </div>
      )}
      <button className="mt-3 inline-block rounded-lg bg-accent px-[15px] py-[9px] font-bold text-bg hover:bg-[#a6b2ff] hover:text-bg m-0 justify-self-start border-0 cursor-pointer disabled:cursor-wait disabled:bg-accent-wash disabled:text-muted" type="submit" disabled={pending}>
        {pending ? (registering ? "Konto wird erstellt …" : "Anmeldung läuft …") : (registering ? "Konto erstellen" : "Einloggen")}
      </button>
      <p className="m-0 text-sm text-muted">
        {registering ? "Du hast schon ein Konto? " : "Noch kein Konto? "}
        <Link className="mt-0 inline-block text-sm font-semibold text-accent [overflow-wrap:anywhere]" href={registering ? "/login" : "/register"}>{registering ? "Einloggen" : "Registrieren"}</Link>
      </p>
    </form>
  );
};
