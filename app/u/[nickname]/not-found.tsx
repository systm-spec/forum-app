import Link from "next/link";

const ProfileNotFound = () => (
  <main id="main-content" className="main-column not-found">
    <p className="eyebrow">404 · Nicht gefunden</p>
    <h1>Dieses Profil gibt es nicht.</h1>
    <p>Prüfe den Nickname oder entdecke die Beiträge im Homefeed.</p>
    <Link className="primary-link" href="/">Zum Homefeed</Link>
  </main>
);

export default ProfileNotFound;
