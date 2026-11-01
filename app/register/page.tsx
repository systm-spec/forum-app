import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";
import { InfoPanel } from "@/components/UI/InfoPanel";

export const metadata: Metadata = { title: "Registrieren · Forum" };

const RegisterPage = () => (
  <>
    <main id="main-content" className="min-w-0 scroll-mt-[94px] max-[700px]:order-1 max-[700px]:w-full max-[700px]:scroll-mt-[86px]">
      <div className="relative mb-7 overflow-hidden rounded-2xl border border-line bg-[linear-gradient(120deg,#292e3b,#222732_70%)] px-[30px] pt-7 pb-[30px] before:absolute before:top-0 before:left-[30px] before:h-[2px] before:w-12 before:bg-accent before:content-[''] max-[700px]:mb-6 max-[700px]:px-5 max-[700px]:py-[23px] max-[700px]:before:left-5">
        <p className="mb-[7px] text-xs font-bold tracking-[.09em] text-accent uppercase">Dein Konto</p>
        <h1 className="mb-[5px] text-[clamp(31px,4vw,42px)] leading-[1.1] tracking-[-.04em] [overflow-wrap:anywhere]">Ein Platz für dich</h1>
        <p className="mb-0 max-w-[56ch] text-muted">Wähle einen Nickname und ein Passwort.</p>
      </div>
      <section className="rounded-2xl border border-line bg-surface p-6" aria-label="Registrierung"><AuthForm mode="register" /></section>
    </main>
    <aside className="sticky top-[110px] grid min-w-0 gap-4 max-[1100px]:static max-[1100px]:col-start-2 max-[1100px]:row-start-2 max-[1100px]:grid-cols-2 max-[700px]:order-2 max-[700px]:w-full max-[700px]:grid-cols-1" aria-label="Informationen zur Registrierung">
      <InfoPanel eyebrow="Gut zu wissen" title="Dein öffentlicher Name">
        <p className="mb-0 text-sm text-muted">Wähle einen Nickname, mit dem du dich in der Community zeigen möchtest. Bewahre dein Passwort gut auf: Eine Passwort-Wiederherstellung ist derzeit nicht verfügbar.</p>
      </InfoPanel>
    </aside>
  </>
);

export default RegisterPage;
