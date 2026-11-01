import Link from "next/link";

const ProfileNotFound = () => (
  <main id="main-content" className="min-w-0 scroll-mt-[94px] max-[700px]:order-1 max-[700px]:w-full max-[700px]:scroll-mt-[86px] rounded-2xl border border-line bg-surface px-[30px] py-12">
    <p className="text-xs font-bold tracking-[.09em] text-soft uppercase">404 · Nicht gefunden</p>
    <h1 className="mb-2 text-[34px] text-text">Dieses Profil gibt es nicht.</h1>
    <p className="text-muted">Prüfe den Nickname oder entdecke die Beiträge im Homefeed.</p>
    <Link className="mt-3 inline-block rounded-lg bg-accent px-[15px] py-[9px] font-bold text-bg hover:bg-[#a6b2ff] hover:text-bg" href="/">Zum Homefeed</Link>
  </main>
);

export default ProfileNotFound;
