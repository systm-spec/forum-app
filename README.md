# Forum

Ein UI-Grundgerüst für eine Community- und Forum-App mit Next.js App Router, React und TypeScript. „Forum“ ist ein vorläufiger Name.

## Starten

Mit der im Projekt festgelegten pnpm-Version:

```bash
pnpm install
pnpm dev
```

Danach ist die App unter [http://localhost:3000](http://localhost:3000) erreichbar.

## Aktueller Demo-Umfang

- Homefeed (`/`), Communitys (`/c/[slug]`) und Threads (`/c/[slug]/post/[id]`) mit verschachtelten Kommentaren
- Gemeinsame, feste Beispieldaten in `lib/demo-data.ts`; keine Datenbank oder Persistenz
- Suche nach Titel, Text und Autor im jeweiligen Feed über den URL-Parameter `q`
- Eigener Nicht-gefunden-Zustand für unbekannte Communitys und Beiträge
- Durchgehend dunkles, responsives Layout mit Source Sans 3

Login, Beiträge schreiben, Antworten und Abstimmungen sind noch nicht verfügbar. Die sichtbaren Stimmzahlen gehören zu den Beispieldaten.

## Prüfungen

```bash
pnpm lint
pnpm exec tsc --noEmit
```
