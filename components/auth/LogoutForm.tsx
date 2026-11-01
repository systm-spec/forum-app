"use client";

import { useActionState } from "react";
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import { logout } from "@/lib/auth/actions";
import type { AuthFormState } from "@/lib/auth/validation";

const initialState: AuthFormState = {};

export const LogoutForm = () => {
  const [state, action, pending] = useActionState(logout, initialState);

  return (
    <form className="relative flex-none" action={action} aria-busy={pending}>
      <button className="inline-flex min-w-0 cursor-pointer items-center gap-[7px] rounded-[9px] border border-line bg-surface px-2.5 py-2 text-sm text-muted hover:border-accent hover:text-accent disabled:cursor-wait disabled:text-muted max-[700px]:p-2" type="submit" disabled={pending} aria-label={pending ? "Abmelden läuft" : "Abmelden"} title="Abmelden">
        <HiOutlineArrowRightOnRectangle className="size-5 flex-none" aria-hidden="true" />
        <span className="max-[700px]:hidden">{pending ? "Wird abgemeldet …" : "Abmelden"}</span>
      </button>
      {state.message && <p className="absolute top-full right-0 mt-2 w-[220px] rounded-[9px] border border-danger bg-surface p-3 text-sm text-danger" role="alert">{state.message}</p>}
    </form>
  );
};
