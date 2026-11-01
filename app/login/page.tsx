import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { InfoPanel } from "@/components/UI/InfoPanel";

export const metadata: Metadata = { title: "Einloggen · Forum" };
type LoginPageProps = { searchParams: Promise<{ registered?: string | string[]; error?: string | string[] }> };

const LoginNotice = async ({ searchParams }: LoginPageProps) => {
  const params = await searchParams;
  if (params.error) return <p className="mb-4 rounded-lg border border-current p-3 text-[15px] text-danger [overflow-wrap:anywhere]" role="alert">Die Anmeldung war nicht erfolgreich. Bitte versuche es erneut.</p>;
  return params.registered === "1" ? <p className="mb-4 rounded-lg border border-current p-3 text-[15px] text-accent [overflow-wrap:anywhere]" role="status">Dein Konto wurde erstellt. Du kannst dich jetzt einloggen.</p> : null;
};

const LoginPage = ({ searchParams }: LoginPageProps) => (
  <>
    <main id="main-content" className="min-w-0 scroll-mt-[94px] max-[700px]:order-1 max-[700px]:w-full max-[700px]:scroll-mt-[86px]">
      <div className="relative mb-7 overflow-hidden rounded-2xl border border-line bg-[linear-gradient(120deg,#292e3b,#222732_70%)] px-[30px] pt-7 pb-[30px] before:absolute before:top-0 before:left-[30px] before:h-[2px] before:w-12 before:bg-accent before:content-[''] max-[700px]:mb-6 max-[700px]:px-5 max-[700px]:py-[23px] max-[700px]:before:left-5">
        <p className="mb-[7px] text-xs font-bold tracking-[.09em] text-accent uppercase">Dein Konto</p>
        <h1 className="mb-[5px] text-[clamp(31px,4vw,42px)] leading-[1.1] tracking-[-.04em] [overflow-wrap:anywhere]">Willkommen zurück</h1>
        <p className="mb-0 max-w-[56ch] text-muted">Melde dich mit deinem Nickname und Passwort an.</p>
      </div>
      <section className="rounded-2xl border border-line bg-surface p-6" aria-label="Login">
        <Suspense fallback={null}><LoginNotice searchParams={searchParams} /></Suspense>
        <AuthForm mode="login" />
      </section>
    </main>
    <aside className="sticky top-[110px] grid min-w-0 gap-4 max-[1100px]:static max-[1100px]:col-start-2 max-[1100px]:row-start-2 max-[1100px]:grid-cols-2 max-[700px]:order-2 max-[700px]:w-full max-[700px]:grid-cols-1" aria-label="Informationen zum Login">
      <InfoPanel eyebrow="Dein Zugang" title="Ein Name für deine Gespräche">
        <p className="mb-0 text-sm text-muted">Dein Nickname ist dein öffentlicher Name. Die Communitys und Diskussionen kannst du auch ohne Anmeldung lesen.</p>
      </InfoPanel>
    </aside>
  </>
);

export default LoginPage;
