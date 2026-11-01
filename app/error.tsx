"use client";

import Link from "next/link";

const ErrorPage = ({ retry }: { error: unknown; retry: () => void }) => (
  <main id="main-content" className="main-column empty-state" role="alert">
    <h1>Inhalte konnten nicht geladen werden</h1>
    <p>Bitte versuche es erneut.</p>
    <button className="primary-link auth-submit" type="button" onClick={() => retry()}>Erneut laden</button>
    <Link className="text-link" href="/">Zum Homefeed</Link>
  </main>
);

export default ErrorPage;
