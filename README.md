# Forum

Community- und Forum-App mit Next.js App Router, React und TypeScript. „Forum“ ist der vorläufige Name. Nutzerkonten, Beiträge, Kommentare und Stimmen liegen in PostgreSQL.

## Voraussetzungen

- Node.js 22 (geprüft mit 22.12.0), pnpm 10.15.0
- Docker Desktop mit erreichbarer Docker-CLI und Compose in der verwendeten WSL-Distribution
- Freier lokaler PostgreSQL-Port, standardmäßig 5432

Prüfe den Docker-Zugriff aus WSL:

```bash
docker compose version
docker info
```

Nur PostgreSQL läuft im Container. Next.js und die Migrationsbefehle laufen lokal in WSL.

## Lokale Konfiguration

Falls noch keine `.env.local` vorhanden ist:

```bash
cp -n .env.example .env.local
```

Ersetze `PGPASSWORD` und `AUTH_SECRET` durch **zwei unabhängig erzeugte** Zufallswerte, beispielsweise jeweils mit `openssl rand -hex 32`. Vorhandene lokale Konfiguration und Secrets beibehalten. `.env.local` ist ignoriert; `.env.example` enthält nur Platzhalter.

Compose erhält `.env.local` explizit über die pnpm-Skripte. Next.js und Drizzle laden dieselbe Datei mit dem Next.js-Environment-Loader. `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER` und `PGPASSWORD` konfigurieren den lokalen Datenbankzugriff; dieselben Zugangsdaten initialisieren den Container. Es gibt keine zweite, separat zu pflegende Datenbank-URL.

`AUTH_URL=http://localhost:3000` muss dem verwendeten App-Ursprung entsprechen. `AUTH_SECRET` verschlüsselt die Auth.js-JWTs. Eine Änderung dieses Secrets macht bestehende Sessions ungültig. Keine dieser Variablen trägt das Präfix `NEXT_PUBLIC_`.

## Starten und stoppen

```bash
pnpm install --frozen-lockfile
pnpm db:start
pnpm db:migrate
pnpm dev
```

Die App ist unter [http://localhost:3000](http://localhost:3000) erreichbar. `db:start` wartet auf den PostgreSQL-Healthcheck. `db:migrate` wendet nur noch nicht ausgeführte Migrationen an.

```bash
pnpm db:stop
```

Dieser Befehl stoppt ausschließlich PostgreSQL im Compose-Projekt. Container und Volume bleiben erhalten. PostgreSQL 18 verwendet das benannte Volume `forum-app_postgres_data` unter `/var/lib/postgresql`; die Daten liegen im Image versionsspezifisch unter `/var/lib/postgresql/18/docker`. Der veröffentlichte Port bindet ausschließlich an `127.0.0.1`. Der Pool verwendet für diese lokale Verbindung kein TLS.

Die Container-Zugangsdaten werden bei der ersten Initialisierung des Volumes gesetzt. Änderungen an `PGUSER`, `PGDATABASE` oder `PGPASSWORD` ändern keine vorhandenen Datenbankkonten automatisch. Bestehende Daten und Volumes erhalten; Hauptversionswechsel separat migrieren.

## Schema und Migrationen

Das Datenmodell steht in `lib/db/schema.ts`. Die SQL-Migrationen einschließlich Drizzle-Metadaten liegen versioniert in `drizzle/`. Nach einer Schemaänderung:

```bash
pnpm db:generate --name=beschreibung_der_aenderung
pnpm db:migrate
```

Die erzeugten SQL-Dateien und Metadaten gemeinsam mit der Schemaänderung versionieren. Ein Schema-Push ist nicht vorgesehen. Migrationen werden in `drizzle.__drizzle_migrations` protokolliert. `lib/db/index.ts` stellt einen serverseitigen, auch bei Hot Reload wiederverwendeten Verbindungspool bereit.

## Nickname und Authentifizierung

- Registrierung unter `/register`, Login unter `/login`, Nickname und Logout im Header
- Nicknames: 3–24 ASCII-Zeichen, erster Buchstabe A–Z, danach auch Zahlen und Unterstriche
- Rand-Leerzeichen werden entfernt. Groß-/Kleinschreibung wird für die Eindeutigkeit ignoriert; PostgreSQL erzwingt den eindeutigen normalisierten Nickname.
- Passwörter: 12–128 Zeichen, ohne Trimmen; Registrierung erfordert eine übereinstimmende Bestätigung
- Argon2id mit `@node-rs/argon2`, 19 MiB Speicher, zwei Durchläufen, Parallelität 1 und zufälligem Salt der Bibliothek
- Nach erfolgreicher Registrierung folgt die Login-Seite. Auth.js prüft Credentials gegen die eigene Drizzle-Nutzertabelle und verwaltet verschlüsselte JWT-Sessions sowie Cookies ohne Datenbankadapter.
- Die sichere Nutzer-ID ist die PostgreSQL-UUID; JWT und Session enthalten als Nutzerdaten ausschließlich ID und Nickname. Passwort-Hashes verlassen die serverseitigen Module nicht.
- Sessions gelten sieben Tage. `getCurrentUser()` in `lib/auth/session.ts` ermittelt sie pro Anfrage ohne globalen Nutzercache. Eine Suspense-Grenze im Header hält das statische Layout darstellbar. `connection()` begrenzt auch die internen Auth.js-Zufallswerte auf echte Anfragen.

Es werden keine E-Mail-Daten erfasst oder gespeichert. Eine Passwort-Wiederherstellung ist derzeit nicht verfügbar.

Die App verwendet die offiziellen serverseitigen Auth.js-Funktionen `signIn`, `signOut` und `auth` sowie Next.js Server Actions. Diese Bibliotheksabläufe sind die beabsichtigte Ausnahme von der Axios-Präferenz, damit Auth.js seine Cookies und Auth-Protokolle selbst verwaltet. Eigene HTTP-Aufrufe verwenden weiterhin Axios; der PostgreSQL-Zugriff erfolgt direkt.

## Versionen und Kompatibilität

Next.js **16.4.3** und React **19.3.0** bleiben unverändert. Auth.js wird entsprechend seiner [offiziellen Next.js-Installation](https://authjs.dev/getting-started/installation) als **next-auth 5.0.0-beta.32** verwendet; seine veröffentlichten Peer-Abhängigkeiten unterstützen Next.js 16 und React 19 ausdrücklich. Der Beta-Status ist eine bewusste Entscheidung für diese Integration, keine Zusage einer stabilen v5-Veröffentlichung.

Drizzle ORM **0.45.4** und Drizzle Kit **0.31.11** verwenden den [offiziell unterstützten node-postgres-Treiber](https://orm.drizzle.team/docs/get-started-postgresql) **pg 8.23.1**. Die Abhängigkeiten sind über pnpm festgehalten. Das [offizielle PostgreSQL-18-Image](https://hub.docker.com/_/postgres) bestimmt den verwendeten Volume-Pfad. Source Sans 3, dunkles Design, Cache Components und Partial Prefetching bleiben erhalten.

## Forum-Funktionen

Home (`/`), Communitys (`/c/[slug]`), Threads (`/c/[slug]/post/[id]`) und Profile (`/u/[nickname]`) sind öffentlich lesbar. Die Themenräume stehen in `lib/communities.ts`. Die Suche filtert Titel, Text und Autor des jeweiligen Feeds über `q` in der URL.

Profile zeigen ausschließlich Nickname, Registrierungsdatum und die dem Nutzer zugeordneten Beiträge und Kommentare. Autoren mit Nutzerkonto sowie der angemeldete Nutzer im Header sind verlinkt. Kommentare im Profil führen direkt zum Kommentaranker im jeweiligen Thread. Unbekannte Nutzer und Profile ohne Inhalte haben eigene Zustände.

Angemeldete Nutzer können Beiträge und Kommentare up- oder downvoten. Derselbe Pfeil nimmt eine bestehende Stimme zurück; der Gegenpfeil wechselt die Richtung. Zusammengesetzte Primärschlüssel und Datenbankbedingungen erlauben nur eine Stimme pro Nutzer/Ziel mit dem Wert −1 oder +1. Keine Stimme wird als fehlende Zeile gespeichert. Eine PostgreSQL-Transaktionssperre pro Nutzer/Ziel serialisiert die Umschaltung auch bei parallelen Requests. Gesamtstand und eigene Stimme stammen aus derselben Leseabfrage. Während der Übermittlung sind beide Pfeile gesperrt; nach einem unklaren Fehler wird der aktuelle Stand neu geladen, statt die Umschaltung automatisch zu wiederholen.

Kommentare und Antworten enthalten 1–10.000 Zeichen nach dem Entfernen äußerer Leerzeichen. Autor und Nutzer-ID stammen ausschließlich aus der serverseitigen Sitzung. Elternkommentare werden serverseitig geprüft; ein zusammengesetzter Fremdschlüssel erzwingt zusätzlich denselben Beitrag. Ein Übermittlungsschlüssel wird bei Wiederholung derselben fehlgeschlagenen Übermittlung wiederverwendet und pro Autor eindeutig gespeichert. Text bleibt bei Fehlern erhalten. Erfolgreiche Aktionen aktualisieren Feed, Community, Thread und Profilansichten über Next.js-Revalidierung und Router-Refresh. Gäste gelangen über klar beschriftete Links zum Login; serverseitige Schreibaktionen prüfen die Sitzung unabhängig von der Oberfläche.

Schreibaktionen verwenden Next.js Server Actions wie die vorhandene Authentifizierung. Der Framework-Transport ist eine dokumentierte Ausnahme von der Axios-Präferenz; für Datenbankzugriffe werden keine eigenen HTTP-Endpunkte benötigt. Nutzerbezogene Stimmen werden pro Anfrage gelesen und nicht global gecacht. Neue Routen und Datenzugriffe liegen unter Suspense-Grenzen mit festen Ladezuständen. Tiefere Kommentarzweige behalten ihre Struktur und begrenzen die visuelle Einrückung auf schmalen Bildschirmen.

Eigene Beiträge erstellen, Bearbeiten, Löschen, Moderation und Profilbearbeitung gehören derzeit nicht zum Funktionsumfang.

## Erforderliche Inhaltsmigration

```bash
pnpm db:migrate
```

`0001_forum_content.sql` wurde auf die vorhandene Datenbank angewendet. Auf weiteren Installationen wird sie mit dem obigen Befehl angewendet. Sie ergänzt Beiträge, Kommentare und beide Stimmtabellen. Sie erhält die vorhandenen Nutzerkonten und übernimmt die bereits vorhandenen Texte einschließlich ihrer bisherigen Beitrags- und Kommentar-IDs. Die Startinhalte werden danach ausschließlich aus der Datenbank gelesen. Es gibt keinen Reset und keine automatische Neuerzeugung von Nutzern.

Für die früheren Autorennamen ist keine Zugehörigkeit zu den bestehenden Konten belegt. Diese Namen bleiben daher mit leerer `author_id` erhalten und werden nicht automatisch gleichnamigen registrierten Nutzern zugeordnet. Neue Kommentare erhalten die tatsächliche Nutzer-ID. Die Erfassungszeit übernommener Inhalte ist der Zeitpunkt ihrer Migration; frühere relative Zeitangaben waren nicht gespeichert. Frühere vorgegebene Stimmzahlen werden durch die Summe tatsächlich gespeicherter Stimmen ersetzt. Kommentarzahlen werden gezählt, nicht übernommen.

Schemaänderungen verwenden weiterhin versionierte Migrationen. Vorhandene SQL-Migrationen nach ihrer Anwendung nicht ändern; weitere Änderungen in einer neuen Migration festhalten.

## Prüfstand

```bash
pnpm lint
pnpm exec tsc --noEmit
```

Für den Ausbau um Profile, Votes und Kommentare liefen beide statischen Prüfungen erfolgreich durch. Die neue Migration wurde einmal zur Einrichtung angewendet. Es wurden kein Dev-Server, kein Browsercheck, keine Parallelitätsprüfung, kein Build und keine zusätzliche Testsuite ausgeführt. Frühere Laufzeitprüfungen der Authentifizierung belegen nicht das neue Verhalten. Die Migration wurde von PostgreSQL erfolgreich übernommen; neue Interaktionen sind in diesem Schritt nicht zur Laufzeit geprüft.
