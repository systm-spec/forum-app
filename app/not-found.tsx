import Link from "next/link";

const NotFound = () => (
  <main id="main-content" className="main-column not-found">
    <p className="eyebrow">404 · Nicht gefunden</p>
    <h1>Hier ist es noch still.</h1>
    <p>Diese Seite ist nicht vorhanden. Prüfe die Adresse oder kehre zum Homefeed zurück.</p>
    <Link className="primary-link" href="/">Zurück zum Homefeed</Link>
  </main>
);

export default NotFound;
