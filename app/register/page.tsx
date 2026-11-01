import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { InfoPanel } from "@/components/info-panel";

export const metadata: Metadata = { title: "Registrieren · Forum" };

const RegisterPage = () => (
  <>
    <main id="main-content" className="main-column">
      <div className="page-heading">
        <p className="eyebrow">Dein Konto</p>
        <h1>Ein Platz für dich</h1>
        <p>Wähle einen Nickname und ein Passwort.</p>
      </div>
      <section className="auth-panel" aria-label="Registrierung"><AuthForm mode="register" /></section>
    </main>
    <aside className="right-column" aria-label="Informationen zur Registrierung">
      <InfoPanel eyebrow="Gut zu wissen" title="Dein öffentlicher Name">
        <p>Wähle einen Nickname, mit dem du dich in der Community zeigen möchtest. Bewahre dein Passwort gut auf: Eine Passwort-Wiederherstellung ist derzeit nicht verfügbar.</p>
      </InfoPanel>
    </aside>
  </>
);

export default RegisterPage;
