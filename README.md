# Forum

Diskussions- und Debattierapp/-Lernapp.
Diskutieren & Debattieren lernen und auf verchiedenen Modi und Leveln zu verschiedenen Themen nach dem Leitsatz "Meine Freiheit endet dort, wo Deine beginnt & deine Freiheit endet, wo Meine beginnt."

## Vorhandener Funktionsumfang

| Bereich | Im Code vorhanden |
| --- | --- |
| Öffentliche Ansichten | Homefeed `/`, Communitys `/c/[slug]`, Threads `/c/[slug]/post/[id]` und Profile `/u/[nickname]` |
| Feeds und Suche | Textbeiträge mit optional angezeigter Beitragsart, Suche nach Titel, Inhalt und Autor über den URL-Parameter `q`; Sortierung nach Erfassungszeit absteigend, bei Gleichstand nach ID |
| Eigene Beiträge | Angemeldete Nutzer erstellen in einer Community Fragen, Thesen oder Lösungsansätze mit Titel und Inhalt; danach Weiterleitung zum Thread |
| Community-Mitgliedschaft | Angemeldete Nutzer können einer Community beitreten und sie wieder verlassen; der persönliche Status erscheint auf der Community-Seite |
| Community-Erstellung | Angemeldete Nutzer erstellen unter `/communities/new` offene Themenräume mit Name, Kurzbeschreibung und Themenabgrenzung; sie werden dabei Mitglied |
| Rollen und Admin-Panel | Effektive Rollen Admin, Mod und User; `/admin` erlaubt dem konfigurierten Admin Nickname-Suche, Mod-Ernennung und globale Mod-Rechte |
| Löschen | Berechtigte Admins/Mods löschen Communitys oder Beiträge samt abhängigen Inhalten; einzelne Kommentare werden als neutraler Platzhalter erhalten |
| Nutzerkonten | Registrierung `/register`, Login `/login`, Logout und Konto-/Profillink im Header |
| Profile | Nickname, Registrierungsdatum, zugeordnete Beiträge und Kommentare mit Inhaltslinks; Leer- und Nicht-gefunden-Zustände |
| Kommentare | Kommentare und verschachtelte Antworten für angemeldete Nutzer, Autorenlinks, Zeitangaben und tatsächliche Kommentarzahlen |
| Votes | Persistente Up-/Downvotes für Beiträge und Kommentare, eigene Stimme und Gesamtstand; erneuter gleicher Vote entfernt die Stimme, Gegenrichtung wechselt sie |
| Rückmeldungen | Lade-, Leer-, Fehler- und Nicht-gefunden-Ansichten sowie Statusanzeigen bei Schreibaktionen; Gäste erhalten Login-Links |

Communitys sind thematische Räume; ein Beitrag mit seiner Diskussion bildet einen Thread (Sub). „Politik“, „Wirtschaft“ und „Recht“ wären mögliche Kategorien, aber keine zusätzliche Hierarchiestufe. Die drei ursprünglichen Räume Werkstatt, Alltag und Lesezeichen und alle neu erstellten Communitys liegen in der PostgreSQL-Tabelle `communities`. Navigation, Homeübersicht und Detailseiten lesen diese Tabelle. Die bisherigen Slugs und Inhalte bleiben erhalten. Persönliche Stimmen und Mitgliedschaften werden pro Anfrage ermittelt und nicht global zwischen Nutzern gecacht. Ein Beitritt drückt Interesse aus, keine Zustimmung zu einer Position; er ändert weder Feed-Sortierung noch Schreibrechte.

## Stack und Struktur

Maßgeblich sind `package.json` und `pnpm-lock.yaml`; bestehende Versionen bei fachlichen Änderungen beibehalten.

| Bestandteil | Repository-Stand |
| --- | --- |
| Framework | Next.js 16.4.3, App Router, Cache Components und Partial Prefetching |
| UI und Sprache | React / React DOM 19.3.0, TypeScript mit strenger Typprüfung |
| Datenbank | PostgreSQL 18, Image `postgres:18-bookworm`, Docker Compose |
| Datenzugriff | Drizzle ORM 0.45.4, Drizzle Kit 0.31.11, `pg` 8.23.1 |
| Authentifizierung | Auth.js `next-auth` 5.0.0-beta.32, Credentials Provider, JWT-Sessions; Beta-Status beachten |
| Passwörter | Argon2id über `@node-rs/argon2` 2.2.2 |
| Gestaltung | CSS mit Tailwind CSS 4, Source Sans 3 über `next/font/google`, `react-icons` |
| Weitere Werkzeuge | Axios, ESLint mit Next.js-/TypeScript-Regeln; Prettier-Konfiguration vorhanden |

```text
app/                  Seiten, gemeinsames Layout, Fehlerseiten und Auth.js-Route
components/           Gemeinsame UI, Kommentar-/Vote-Steuerungen und Auth-Formulare
lib/auth/             Validierung, Passwortlogik, Sessions, Auth-Aktionen und zentrale Berechtigungsprüfung
lib/db/               Drizzle-Schema, Verbindungskonfiguration und wiederverwendbarer Pool
lib/forum/            Inhaltsabfragen, Schreibaktionen und Ansichtstypen
lib/forum/queries.ts  Communitys, Beiträge, Kommentare und Profile aus PostgreSQL
lib/search.ts         Feed-Filter und Suchparameter
lib/format.ts         Datumsformatierung und Inhalts-/Profilpfade
auth.ts               Auth.js-Konfiguration
types/next-auth.d.ts   Session-/JWT-Typen
drizzle/              SQL-Migrationen, Journal und Schema-Snapshots
compose.yaml          Ausschließlich PostgreSQL
drizzle.config.ts     Schema-, Migrations- und Verbindungskonfiguration
app/globals.css       Gemeinsame Styles und Design-Tokens
```

## Lokale Einrichtung

### Voraussetzungen

- Node.js 22 für die bisherige WSL-Entwicklungsumgebung; im Repository liegt keine `.nvmrc` oder `.node-version`.
- pnpm **10.15.0**, festgelegt über `packageManager`.
- Docker Desktop mit funktionierendem Docker-/Compose-Zugriff aus WSL und freiem lokalen Datenbankport.

Nur PostgreSQL läuft im Container. Next.js und Drizzle-Befehle laufen lokal in WSL.

### Umgebungsvariablen

Eine vorhandene `.env.local` beibehalten. Für eine neue Installation `.env.example` nach `.env.local` kopieren und die Platzhalter durch eigene Werte ersetzen.

Die benötigten Namen folgen aus `lib/db/config.ts`, `compose.yaml` und `auth.ts`:

```dotenv
PGHOST=127.0.0.1
PGPORT=5432
PGDATABASE=<lokaler_datenbankname>
PGUSER=<lokaler_datenbanknutzer>
PGPASSWORD=<zufaelliges_datenbankpasswort>
AUTH_SECRET=<separater_zufaelliger_auth_schluessel>
AUTH_URL=http://localhost:3000
ADMIN_USER_ID=<uuid_des_bestehenden_dev_kontos>
```

Die Angaben in spitzen Klammern sind zu ersetzen und keine Zugangsdaten. Datenbankname und Nutzer für eine neue Datenbank selbst wählen; bei einem bestehenden Volume dessen vorhandene Werte verwenden. `PGPASSWORD` und `AUTH_SECRET` unabhängig erzeugen, beispielsweise jeweils mit `openssl rand -hex 32`. Keine echten Werte in Git, Logs oder Browsercode übernehmen.

Compose lädt `.env.local` über die vorhandenen Skripte. Next.js lädt sie automatisch, Drizzle über `@next/env`. Die `PG*`-Werte konfigurieren den Pool; Compose verwendet dieselben Datenbank-, Nutzer- und Passwortwerte zur Initialisierung. Es gibt keine zusätzliche Datenbank-URL. `AUTH_URL` muss zum verwendeten App-Ursprung passen. Ein Wechsel von `AUTH_SECRET` macht bestehende JWT-Sessions ungültig.

`.env.local` ist durch `.gitignore` ausgeschlossen. Keine dieser Variablen soll als `NEXT_PUBLIC_*` veröffentlicht werden.

`ADMIN_USER_ID` ist die stabile UUID des einzigen Admin-Kontos aus `users.id`. Sie wird serverseitig aus `.env.local` gelesen; bei fehlendem oder ungültigem Wert ist niemand Admin. Die lokale `.env.local` ist für das vorhandene Konto `dev` auf dessen Datenbank-ID gesetzt. In anderen Umgebungen die UUID des dort vorgesehenen bestehenden Kontos ausdrücklich eintragen und den Next.js-Prozess nach einer Änderung neu starten. Nicknames, Registrierungsreihenfolge und JWT-Rollen werden nicht zur Admin-Ernennung verwendet. Der Admin-Eintrag kann nur über diese Serverkonfiguration geändert werden.

### Installation und Start

```bash
pnpm install --frozen-lockfile
pnpm db:start
pnpm db:migrate
pnpm dev
```

Danach: [http://localhost:3000](http://localhost:3000). Bei Docker-Problemen zuerst `docker compose version` und `docker info` aus WSL prüfen.

| Skript | Wirkung laut `package.json` |
| --- | --- |
| `pnpm dev` | Startet `next dev` |
| `pnpm db:start` | Startet PostgreSQL mit `docker compose --env-file .env.local up -d --wait postgres` und wartet auf den Healthcheck |
| `pnpm db:stop` | Stoppt nur den PostgreSQL-Service; löscht weder Container noch Volume |
| `pnpm db:generate --name=beschreibung` | Erzeugt eine Drizzle-Migration aus Schemaänderungen |
| `pnpm db:migrate` | Wendet ausstehende versionierte Migrationen an |

PostgreSQL bindet ausschließlich an `127.0.0.1:${PGPORT}`, standardmäßig Port 5432. Das benannte Volume `forum-app_postgres_data` liegt im Container unter `/var/lib/postgresql`. Die lokale Pool-Konfiguration verwendet kein TLS. Zugangsdaten werden bei der ersten Initialisierung des Volumes gesetzt; spätere Änderungen der Umgebungswerte ändern vorhandene Datenbankkonten nicht automatisch. Bestehende Daten und Volumes erhalten, Hauptversionswechsel separat migrieren.

## Datenmodell und Migrationen

`lib/db/schema.ts` definiert `users`, `mod_permissions`, `communities`, `community_memberships`, `posts`, `comments`, `post_votes` und `comment_votes`. `lib/db/index.ts` hält den serverseitigen Pool auch bei Hot Reload wiederverwendbar.

- `0000_users.sql`: Nutzer mit UUID, Nickname, eindeutigem normalisiertem Nickname, Passwort-Hash und Erstellungszeitpunkt.
- `0001_forum_content.sql`: Inhaltstabellen, Fremdschlüssel und Vote-Bedingungen; übernimmt die vorhandenen Texte mit unveränderten Beitrags- und Kommentar-IDs.
- `0002_communities_posts_memberships.sql`: Übernimmt die drei Communitys mit bisherigen Slugs und Texten in eine referenzierte Tabelle, ergänzt Mitgliedschaften und Beitragsarten sowie einen eindeutigen Übermittlungsschlüssel für neue Beiträge. Bestehende Beitrags- und Kommentar-IDs bleiben unverändert; Bestandsbeiträge behalten `kind = NULL` und erhalten keine erfundene Art.
- `0003_create_communities.sql`: Ergänzt für jede Community eine UUID, nullable Ersteller- und Themenabgrenzungsfelder sowie einen eindeutigen Übermittlungsschlüssel. Bestehende Communitys erhalten eine UUID, aber keinen erfundenen Ersteller und keine erfundene Themenabgrenzung.
- `0004_roles_and_moderation.sql`: Ergänzt `users.role` mit Standard `user`, eine globale Mod-Konfiguration mit drei anfänglich deaktivierten Rechten und `comments.deleted_at` für erhaltene Antwortbäume. Bestehende Konten bleiben `user`.
- Früher übernommene Autorennamen ohne belegtes Konto behalten eine leere `author_id`. Sie werden weder gleichnamigen Konten zugeordnet noch als neue Nutzer erzeugt. Ihre Erfassungszeit ist der Migrationszeitpunkt. Neue Kommentare erhalten die tatsächliche Nutzer-ID.
- Zusammengesetzte Vote-Primärschlüssel erlauben höchstens eine Stimme je Nutzer/Ziel; Wertebedingungen erlauben nur −1 oder +1. Keine Stimme entspricht einer fehlenden Zeile. Transaktionssperren serialisieren Umschalten und Zurücknehmen.
- Kommentare werden serverseitig auf 1–10.000 Zeichen nach äußerem Trimmen geprüft. Ein zusammengesetzter Fremdschlüssel sichert denselben Beitrag für Elternkommentar und Antwort. Ein eindeutiger Übermittlungsschlüssel pro Autor verhindert doppelte Speicherung bei Wiederholungen.
- Neue Beiträge brauchen genau eine Art (`question`, `thesis` oder `solution`), einen Titel mit 1–300 und Inhalt mit 1–10.000 Zeichen nach äußerem Trimmen. Autor und Nickname stammen aus der Sitzung. Ein eindeutiger Übermittlungsschlüssel pro Autor macht wiederholte Anfragen sicher. Beiträge und Mitgliedschaften referenzieren eine vorhandene Community; der zusammengesetzte Mitgliedschaftsschlüssel erlaubt höchstens einen Beitritt je Nutzer und Community. Austritt entfernt nur die Mitgliedschaft, keine Beiträge oder Kommentare.
- Neue Communitys brauchen einen Namen mit 3–100, eine Kurzbeschreibung mit 10–160 und eine Themenabgrenzung mit 10–1.000 Zeichen nach äußerem Trimmen. Die Kurzbeschreibung wird in den bisherigen Feldern `description` und `short_description` gespeichert, damit bestehende Leser und Daten erhalten bleiben; die Themenabgrenzung liegt in `topic_boundary`. Der Ersteller stammt ausschließlich aus der Sitzung und erhält daraus keine zusätzlichen Rechte. Der Slug entsteht aus dem Namen in kleingeschriebenen ASCII-Zeichen mit Bindestrichen (Umlaute werden vereinfacht, `ß` zu `ss`); Kollisionen erhalten `-2`, `-3` usw. Der Slug bleibt durch den Primärschlüssel eindeutig, die UUID ist die stabile interne ID. Erstellung und Erstmitgliedschaft liegen in einer Transaktion; ein eindeutiger Übermittlungsschlüssel je Ersteller verhindert doppelte Erstellung bei Wiederholung.
- Die Datenbankrolle ist `user` oder `mod`; `admin` wird ausschließlich aus einer gültigen `ADMIN_USER_ID` und der vorhandenen Nutzer-ID abgeleitet. Mod-Rechte für Community-, Beitrags- und Kommentarlöschung stehen in genau einer Konfigurationszeile und sind zunächst deaktiviert. Nur Admins dürfen `user` und `mod` umschalten oder diese Rechte ändern; der konfigurierte Admin ist nicht herabstufbar. Community-Ersteller, Autoren und Mitglieder erhalten keine zusätzlichen Löschrechte. Jede privilegierte Aktion liest Rolle und Mod-Konfiguration erneut aus PostgreSQL.
- Community-Löschung entfernt in einer Transaktion die Mitgliedschaften, Beiträge, Kommentare und zugehörigen Votes. Beitragslöschung entfernt den ganzen Gesprächsfaden samt Votes. Einzelne Kommentare behalten ihre ID und Antworten, verlieren aber Text und sichtbare Autorendaten; ihre Votes werden gelöscht und neue Votes serverseitig abgelehnt. Gelöschte Kommentare erscheinen nicht mehr in Autorenprofilen. Löschungen bestätigen den Umfang in der Oberfläche; bereits entfernte Ziele erhalten eine verständliche Rückmeldung. Nutzerkonten bleiben erhalten.

Nach einer Schemaänderung `pnpm db:generate --name=beschreibung` ausführen, die SQL-Migration prüfen und mit `pnpm db:migrate` anwenden. SQL-Dateien, Journal und Snapshots gemeinsam versionieren; angewendete Migrationen stehen in `drizzle.__drizzle_migrations`. Bereits angewendete Migrationen nicht ändern; weitere Änderungen erhalten eine neue Migration. Kein Schema-Push oder Datenbankreset als Ersatz. Zähler aus tatsächlichen Datensätzen berechnen und keine Stimmen oder Kontozuordnungen erfinden.

## Login und Registrierung

Es werden ausschließlich Nickname und Passwort verwendet, ohne E-Mail-Feld, Ersatzadressen oder Mailabläufe. Die Registrierung verlangt eine Passwortbestätigung und führt anschließend zur Login-Seite. Es gibt keine dokumentierten Standardzugänge; ein eigenes Konto wird über `/register` erstellt.

Nicknames haben 3–24 ASCII-Zeichen: erster Buchstabe A–Z, danach auch Zahlen und Unterstriche. Äußere Leerzeichen werden entfernt; Groß-/Kleinschreibung unterscheidet keine Konten. PostgreSQL erzwingt die Eindeutigkeit.

Servervalidierung und HTML-Felder akzeptieren Passwörter mit **5–128 Zeichen**, Passwörter werden nicht getrimmt. Die Speicherung verwendet Argon2id mit 19 MiB Speicher, zwei Durchläufen und Parallelität 1.

Auth.js prüft Credentials gegen die eigene Drizzle-Nutzertabelle und verwaltet JWTs und Auth-Cookies ohne Datenbankadapter. Die Session gilt sieben Tage; ID und Nickname sind die einzigen nutzerbezogenen JWT-/Session-Daten. Hashes und vertrauliche Konfiguration bleiben serverseitig. `getCurrentUser()` ermittelt die Sitzung pro Anfrage ohne globalen Nutzercache; `connection()` begrenzt auch interne Auth.js-Zufallswerte auf echte Anfragen.

## Entwicklungsleitplanken

### Umfang und Code

- Nur den beauftragten Umfang umsetzen, vorhandene Änderungen und Inhalte erhalten. Kleine reversible Entscheidungen selbst treffen; wesentliche Produktentscheidungen gezielt klären. Wireframes oder separate Designvorschauen nur auf ausdrücklichen Wunsch.
- Aktuelle Next.js-/React-Versionen und kompatible Abhängigkeiten beibehalten. Versionswechsel als eigene Wartungsaufgabe anhand offizieller Dokumentation und Paketmetadaten prüfen. pnpm und Lockdatei pflegen; zusätzliche Bibliotheken nur für einen konkreten Bedarf.
- Vor Änderungen Dateien, Skripte und Konventionen lesen. Bei versionsabhängigen Next.js-APIs die mitinstallierten Anleitungen unter `node_modules/next/dist/docs/` lesen und Deprecations beachten.
- Benannte Exporte und Arrow Functions bevorzugen: `export const Component = (...) => ...`. Erforderliche Framework-Exporte beibehalten, etwa `const Page = (...) => ...; export default Page;`.
- Komponenten nach klaren UI-Aufgaben schneiden und gemeinsam gebrauchte Bausteine über Props und Komposition wiederverwenden. Feature-interne Hilfen lokal halten. Kurze Wege und wenige Abstraktionsebenen; keine unnötige generische API-Schicht.
- Explizite Props-Typen, verständliche englische Bezeichner und stabile IDs als React-Keys verwenden. Unnötiges `any` und kopierte Geschäftslogik vermeiden. Lokalen State bevorzugen; Custom Hooks für wiederkehrende zustandsbehaftete Logik. Gründe und nicht offensichtliche Zusammenhänge kommentieren. Auf Deutsch klar und konkret kommunizieren.

### Daten, HTTP und Rendering

- Server Components für geeignete Darstellung und Datenzugriffe nutzen; Client Components auf Interaktion, lokalen State und Browser-APIs begrenzen. Vertrauliche Logik mit `server-only` vom Client fernhalten.
- Auth.js über `auth`, `signIn` und `signOut` verwenden. Schreibaktionen nutzen Next.js Server Actions; deren Framework-Transport bleibt erhalten. Für eigene HTTP-Anfragen das vorhandene Axios verwenden. Native `fetch`-Ausnahmen technisch begründen; direkte Datenbankzugriffe brauchen keinen eigenen HTTP-Endpunkt.
- Eingaben an der Servergrenze validieren und Schreibrechte serverseitig prüfen. Identitätsprüfung ersetzt keine Berechtigungsprüfung. Nutzerinhalte sicher als Text rendern; erlaubtes Rich Text/HTML erst mit geeigneter Sanitization ergänzen.
- Cache Components und Partial Prefetching erhalten. URL-Hooks sowie `params`, `searchParams` und Session-Zugriffe unter passende Suspense-Grenzen legen; die Grenze muss oberhalb des tatsächlichen Zugriffs liegen. Deterministische Fallbacks und passende Lade-, Leer-, Fehler- und Nicht-gefunden-Zustände vorsehen. Keine globalen Nutzerzustände cachen.
- Next.js-Links und direkt erreichbare Detailrouten verwenden. Teilbare Suche, Filter und Sortierung nach Möglichkeit in der URL halten. Mutationen aktualisieren betroffene Ansichten; laufende Requests und Fehler verständlich darstellen.

### Design und Barrierefreiheit

- Ausschließlich dunkles, ruhiges Design: kein Hellmodus oder Theme-Umschalter. Hintergrund `#181B23`, Oberflächen `#222732`, sparsamer Akzent `#8C9DFF`. Farben, Abstände, Radien und Typografie zentral in `app/globals.css` pflegen; auch sekundäre und deaktivierte Inhalte lesbar halten.
- Source Sans 3 zentral über `next/font/google` und die vorhandene Outline-Familie von `react-icons` mit konsistenten Größen und Strichstärken verwenden. Reine Icon-Aktionen zugänglich beschriften, dekorative Icons kennzeichnen.
- Fixierten Header mit Suche und Kontozugang berücksichtigen, auch bei Fokus und Sprungzielen. Desktop mit drei Spalten und breiterem Hauptinhalt; Gesamt-/Textbreite begrenzen. Der goldene Schnitt ist Orientierung, Lesbarkeit und sinnvolle Seitenleistenbreiten bestimmen die Proportionen. Auf schmalen Bildschirmen Seitenleisten umordnen und wichtige Funktionen erreichbar halten.
- Semantische Elemente, echte Links/Buttons, beschriftete Eingaben, sichtbaren Fokus und Tastaturbedienung verwenden. Zustände nicht allein durch Farbe vermitteln. Lange Inhalte und tiefe Kommentarzweige dürfen keinen horizontalen Overflow erzeugen. Sichtbare Aktionen müssen zum Entwicklungsstand passen.

### Abschlussprüfungen

```bash
pnpm lint
pnpm exec tsc --noEmit
```

Entstandene Fehler beheben. Standardmäßig keine zusätzliche Testsuite, keinen Build und keine weiteren Prüfabläufe ohne Auftrag ausführen. Bei Layoutänderungen Desktop, schmale Bildschirme, Header-Überlappungen und Tastaturbedienung berücksichtigen. Abschließend Änderungen, tatsächlich ausgeführte Prüfungen und Einschränkungen kurz berichten; Oberflächendarstellung allein belegt keine funktionierende Persistenz.

Die installierte Next.js-Version kann bei `next dev` automatisch eine `AGENTS.md` mit Framework-Hinweisen neu erzeugen (`node_modules/next/dist/server/lib/generate-agent-files.js`). Die projektspezifischen Leitplanken stehen in dieser README.

## Offene Punkte und Prüfstand

- Noch nicht implementiert: wählbare Feed-Sortierung, Bearbeiten, weitergehende Moderationswerkzeuge, Profilbearbeitung und Passwort-Wiederherstellung. Debatten, Themenverknüpfungen, Kurse, Scores und spätere Skill-/Teilnahmeberechtigungen gehören nicht zum aktuellen Modell. Chat, Awards und komplexe Empfehlungen sind mögliche spätere Erweiterungen.
