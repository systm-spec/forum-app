"use client";

import { useActionState } from "react";
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import { logout } from "@/lib/auth/actions";
import type { AuthFormState } from "@/lib/auth/validation";

const initialState: AuthFormState = {};

export const LogoutForm = () => {
  const [state, action, pending] = useActionState(logout, initialState);

  return (
    <form className="logout-form" action={action} aria-busy={pending}>
      <button className="account-button" type="submit" disabled={pending} aria-label={pending ? "Abmelden läuft" : "Abmelden"} title="Abmelden">
        <HiOutlineArrowRightOnRectangle aria-hidden="true" />
        <span>{pending ? "Wird abgemeldet …" : "Abmelden"}</span>
      </button>
      {state.message && <p className="logout-error" role="alert">{state.message}</p>}
    </form>
  );
};
