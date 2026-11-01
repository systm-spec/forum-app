# Forum

Community- und Forum-App mit Next.js App Router, React und TypeScript. „Forum“ ist der vorläufige Name. Öffentliche Feeds und Diskussionen verwenden feste Beispieldaten; Nutzerkonten liegen in PostgreSQL.

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

Das Nutzerschema steht in `lib/db/schema.ts`. Die SQL-Migrationen einschließlich Drizzle-Metadaten liegen versioniert in `drizzle/`. Nach einer Schemaänderung:

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

## Aktueller Funktionsumfang und Prüfungen

Home (`/`), Communitys (`/c/[slug]`) und Threads (`/c/[slug]/post/[id]`) bleiben öffentlich lesbar. Beiträge, Kommentare und angezeigte Stimmen stammen weiterhin aus `lib/demo-data.ts`. Die Suche filtert Titel, Text und Autor des jeweiligen Feeds über `q` in der URL. Eigene Beiträge, Antworten und Abstimmungen folgen später und können die vorhandene Nutzer-ID verwenden.

```bash
pnpm lint
pnpm exec tsc --noEmit
```

Zusätzlich geprüft: PostgreSQL healthy, versionierte Migration und erneute Anwendung, Datenpersistenz nach Stoppen und Neustart, Registrierung und Servervalidierung, Nickname-Kollision bei anderer Groß-/Kleinschreibung, falsches Passwort, erfolgreicher Login, Session bei erneuten Requests mit demselben Cookie, Trennung anonymer und angemeldeter Requests, Logout sowie öffentliche Home-/Community-/Thread-Routen. Dabei wurden echte Server-Action-Formulare per HTTP und Serverlogs geprüft. Ein technisches Prüfkonto mit Präfix `AuthCheck_` wurde in der lokalen Datenbank belassen.

Browserwerkzeuge und ein Browser waren nicht verfügbar. Klickabläufe, Browser-Neuladen, visuelle Formularzustände und Browserkonsole wurden daher nicht geprüft. Kein Build und keine neue Testsuite.

In der Prüfumgebung waren die vorhandenen Compose-Verknüpfungen unter `/mnt/wsl` mit einem E/A-Fehler nicht ausführbar. Für Start und Stopp wurde dieselbe offizielle Compose-Version 5.6.1 mit verifizierter Prüfsumme vorübergehend in `/tmp` verwendet. Diese Umgebungsumgehung gehört nicht zur App; für die normalen pnpm-Datenbankbefehle muss `docker compose` in WSL funktionieren.
