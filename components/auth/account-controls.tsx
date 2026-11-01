import Link from "next/link";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { getCurrentUser } from "@/lib/auth/session";
import { LogoutForm } from "./logout-form";

export const AccountFallback = () => (
  <div className="account-controls" role="status" aria-label="Konto wird geladen">
    <span className="account-button"><HiOutlineUserCircle aria-hidden="true" /><span>Konto …</span></span>
  </div>
);

export const AccountControls = async () => {
  const user = await getCurrentUser();

  return (
    <div className="account-controls">
      {user ? (
        <>
          <span className="account-name" title={`Angemeldet als ${user.nickname}`}>
            <HiOutlineUserCircle aria-hidden="true" /><span>{user.nickname}</span>
          </span>
          <LogoutForm />
        </>
      ) : (
        <>
          <Link className="account-button" href="/login" aria-label="Einloggen"><HiOutlineUserCircle aria-hidden="true" /><span>Login</span></Link>
          <Link className="account-register" href="/register">Registrieren</Link>
        </>
      )}
    </div>
  );
};
