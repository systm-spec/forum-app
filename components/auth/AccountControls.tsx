import Link from "next/link";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { getCurrentUser } from "@/lib/auth/session";
import { profilePath } from "@/lib/format";
import { LogoutForm } from "./LogoutForm";

export const AccountFallback = () => (
  <div className="flex min-w-0 max-w-full items-center justify-self-end gap-2.5 max-[700px]:gap-[7px]" role="status" aria-label="Konto wird geladen">
    <span className="inline-flex min-w-0 cursor-pointer items-center gap-[7px] rounded-[9px] border border-line bg-surface px-2.5 py-2 text-sm text-muted hover:border-accent hover:text-accent disabled:cursor-wait disabled:text-muted max-[700px]:p-2"><HiOutlineUserCircle className="size-5 flex-none" aria-hidden="true" /><span className="max-[700px]:hidden">Konto …</span></span>
  </div>
);

export const AccountControls = async () => {
  const user = await getCurrentUser();

  return (
    <div className="flex min-w-0 max-w-full items-center justify-self-end gap-2.5 max-[700px]:gap-[7px]">
      {user ? (
        <>
          <Link className="inline-flex min-w-0 items-center gap-[7px] text-sm text-muted hover:text-accent max-[700px]:gap-[5px]" href={profilePath(user.nickname)} title={`Profil von ${user.nickname}`}>
            <HiOutlineUserCircle className="size-5 flex-none" aria-hidden="true" /><span className="max-w-[13ch] overflow-hidden text-ellipsis whitespace-nowrap max-[700px]:max-w-[8ch]">{user.nickname}</span>
          </Link>
          <LogoutForm />
        </>
      ) : (
        <>
          <Link className="inline-flex min-w-0 cursor-pointer items-center gap-[7px] rounded-[9px] border border-line bg-surface px-2.5 py-2 text-sm text-muted hover:border-accent hover:text-accent disabled:cursor-wait disabled:text-muted max-[700px]:p-2" href="/login" aria-label="Einloggen"><HiOutlineUserCircle className="size-5 flex-none" aria-hidden="true" /><span className="max-[700px]:hidden">Login</span></Link>
          <Link className="text-sm text-accent max-[700px]:text-xs" href="/register">Registrieren</Link>
        </>
      )}
    </div>
  );
};
