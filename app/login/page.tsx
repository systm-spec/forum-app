import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { InfoPanel } from "@/components/info-panel";

export const metadata: Metadata = { title: "Einloggen · Forum" };
type LoginPageProps = { searchParams: Promise<{ registered?: string | string[]; error?: string | string[] }> };

const LoginNotice = async ({ searchParams }: LoginPageProps) => {
  const params = await searchParams;
  if (params.error) return <p className="form-error" role="alert">Die Anmeldung war nicht erfolgreich. Bitte versuche es erneut.</p>;
  return params.registered === "1" ? <p className="form-notice" role="status">Dein Konto wurde erstellt. Du kannst dich jetzt einloggen.</p> : null;
};

const LoginPage = ({ searchParams }: LoginPageProps) => (
  <>
    <main id="main-content" className="main-column">
      <div className="page-heading">
        <p className="eyebrow">Dein Konto</p>
        <h1>Willkommen zurück</h1>
        <p>Melde dich mit deinem Nickname und Passwort an.</p>
      </div>
      <section className="auth-panel" aria-label="Login">
        <Suspense fallback={null}><LoginNotice searchParams={searchParams} /></Suspense>
        <AuthForm mode="login" />
      </section>
    </main>
    <aside className="right-column" aria-label="Informationen zum Login">
      <InfoPanel eyebrow="Dein Zugang" title="Ein Name für deine Gespräche">
        <p>Dein Nickname ist dein öffentlicher Name. Die Communitys und Diskussionen kannst du auch ohne Anmeldung lesen.</p>
      </InfoPanel>
    </aside>
  </>
);

export default LoginPage;
