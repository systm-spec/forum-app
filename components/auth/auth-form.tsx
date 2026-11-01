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
    <form className="auth-form" action={action} aria-busy={pending}>
      {state.message && <p className="form-error" role="alert">{state.message}</p>}
      <div className="form-field">
        <label htmlFor="nickname">Nickname</label>
        <input
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
        <p id="nickname-hint" className="field-hint">3–24 Zeichen: A–Z, Zahlen und Unterstriche. Beginne mit einem Buchstaben. Groß- und Kleinschreibung unterscheiden keine Konten.</p>
        {errors?.nickname && <p id="nickname-error" className="field-error" role="alert">{errors.nickname}</p>}
      </div>
      <div className="form-field">
        <label htmlFor="password">Passwort</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={registering ? "new-password" : "current-password"}
          minLength={12}
          maxLength={128}
          required
          aria-invalid={Boolean(errors?.password)}
          aria-describedby={errors?.password ? "password-error password-hint" : "password-hint"}
        />
        <p id="password-hint" className="field-hint">12–128 Zeichen. Leerzeichen sind erlaubt.</p>
        {errors?.password && <p id="password-error" className="field-error" role="alert">{errors.password}</p>}
      </div>
      {registering && (
        <div className="form-field">
          <label htmlFor="password-confirmation">Passwort bestätigen</label>
          <input
            id="password-confirmation"
            name="passwordConfirmation"
            type="password"
            autoComplete="new-password"
            minLength={12}
            maxLength={128}
            required
            aria-invalid={Boolean(errors?.passwordConfirmation)}
            aria-describedby={errors?.passwordConfirmation ? "password-confirmation-error" : undefined}
          />
          {errors?.passwordConfirmation && <p id="password-confirmation-error" className="field-error" role="alert">{errors.passwordConfirmation}</p>}
        </div>
      )}
      <button className="primary-link auth-submit" type="submit" disabled={pending}>
        {pending ? (registering ? "Konto wird erstellt …" : "Anmeldung läuft …") : (registering ? "Konto erstellen" : "Einloggen")}
      </button>
      <p className="auth-switch">
        {registering ? "Du hast schon ein Konto? " : "Noch kein Konto? "}
        <Link className="text-link" href={registering ? "/login" : "/register"}>{registering ? "Einloggen" : "Registrieren"}</Link>
      </p>
    </form>
  );
};
