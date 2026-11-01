import Link from "next/link";

const NotFound = () => (
  <main id="main-content" className="min-w-0 scroll-mt-[94px] max-[700px]:order-1 max-[700px]:w-full max-[700px]:scroll-mt-[86px] rounded-2xl border border-line bg-surface px-[30px] py-12">
    <p className="text-xs font-bold tracking-[.09em] text-soft uppercase">404 · Nicht gefunden</p>
    <h1 className="mb-2 text-[34px] text-text">Hier ist es noch still.</h1>
    <p className="text-muted">Diese Seite ist nicht vorhanden. Prüfe die Adresse oder kehre zum Homefeed zurück.</p>
    <Link className="mt-3 inline-block rounded-lg bg-accent px-[15px] py-[9px] font-bold text-bg hover:bg-[#a6b2ff] hover:text-bg" href="/">Zurück zum Homefeed</Link>
  </main>
);

export default NotFound;
