<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Projektanweisungen

## Ziel und Arbeitsumfang

Entwickle eine eigenständige Community- und Forum-Webapp mit Reddit-ähnlichen
Mechaniken, eigener visueller Identität und sauber nachvollziehbarem Code.
Das Projekt dient als Portfolio-Projekt und soll später nutzbar sein können.

- Das erste UI-Grundgerüst ist umgesetzt. Entwickle auf diesem Stand weiter und ergänze fachliche Funktionen schrittweise.
- Setze die jeweils beauftragte Aufgabe vollständig um. Diese Datei ist kein Auftrag, sämtliche erwähnten Funktionen gleichzeitig zu bauen.
- Erstelle Wireframes oder zusätzliche Designvorschauen nur auf ausdrücklichen Wunsch.
- Halte die Architektur dem Umfang eines Forums angemessen: klare Zuständigkeiten, kurze nachvollziehbare Wege und wenige Abstraktionsebenen.
- Datenbank, Auth-Anbieter, Hosting, endgültiger Name und Logo sind noch offen. Lege sie nicht beiläufig als verbindliche Projektentscheidungen fest. Verwende bei Bedarf klar erkennbare Platzhalter.

## Aktueller Umsetzungsstand

Stand nach der Stabilisierung des UI-Grundgerüsts:

- Das Next.js-Projekt ist initialisiert, die Starter-Inhalte sind entfernt, Prettier ist eingerichtet und das Repository liegt privat auf GitHub.
- Homefeed, Community-Seiten und direkt aufrufbare Thread-Ansichten mit eingerückten Kommentaren sind umgesetzt.
- Gemeinsame Beispieldaten, eine Suche im jeweiligen Feed und Nicht-gefunden-Seiten sind vorhanden.
- Das Layout ist responsiv und durchgehend dunkel. Source Sans 3 ersetzt Geist.
- `Forum` bleibt der vorläufige Name.
- Login, eigene Beiträge, Antworten und echte Abstimmungen sind noch nicht verfügbar. Die angezeigten Stimmzahlen sind Demodaten.
- Laufzeitabhängige URL-Hooks, `params` und `searchParams` liegen unter Suspense-Grenzen mit deterministischen Fallbacks. Die statische Header- und Navigationsstruktur bleibt darstellbar; Suchziel und Suchtext folgen der URL. Cache Components, Partial Prefetching und deren Validierung bleiben aktiv.
- Begrenzter Dev-Server-Check: Home, alle drei Communitys, alle vier Threads, Suchtreffer und leere Ergebnisse, unbekannte URLs sowie falsche Community-/Thread-Zuordnungen geprüft. Gerenderte Inhalte, Suchformular, aktive Navigation, Kommentarzahlen und Serverlogs wurden kontrolliert. Dynamische Nicht-gefunden-Fälle senden den gestreamten Next.js-404-Zustand mit `noindex`.
- Browserprüfungen einschließlich Klicknavigation, Zurück/Vorwärts und Browserkonsole waren mangels verfügbarer Browserwerkzeuge und Browser nicht möglich.
- `pnpm lint` und `pnpm exec tsc --noEmit` liefen erfolgreich durch. Nach Codeänderungen sind die Prüfungen erneut auszuführen.

Gleiche diesen Überblick vor neuen Aufgaben mit dem tatsächlichen Code ab und
pflege ihn bei fachlichen Änderungen kurz mit. Er ist kein Auftrag, alle noch
fehlenden Funktionen gleichzeitig umzusetzen.

## Stack und Versionen

- Verwende Next.js mit App Router, React und TypeScript mit strenger Typprüfung.
- Nutze beim Projektstart die aktuellen stabilen, miteinander kompatiblen Versionen von Next.js und React. Prüfe Versionen und Kompatibilität anhand offizieller Dokumentation und Paketmetadaten; rate keine Versionsnummern.
- Falls sich die neueste stabile React-Version noch nicht mit der neuesten stabilen Next.js-Version kombinieren lässt, benenne den Konflikt und wähle eine offiziell unterstützte Kombination.
- Halte den Stack aktuell. Behandle größere Versionswechsel als eigene Wartungsaufgabe mit Prüfung der Migration und Auswirkungen.
- Verwende pnpm und pflege die zugehörige Lockdatei. Nutze die im Projekt festgelegte Node.js-Version und Paketmanager-Version.
- Prüfe vor Änderungen vorhandene Dateien, Skripte und Konventionen. Ergänze neue Abhängigkeiten nur für einen konkreten Bedarf.

## React und Code-Stil

- Bevorzuge benannte Exporte und Arrow Functions: `export const Component = (...) => ...`.
- Verwende die vom Framework benötigten Exporte. Für eine Next.js-Seite ist beispielsweise `const Page = (...) => ...; export default Page;` sinnvoll. Nutze andere Funktionsformen, wenn sie technisch erforderlich oder deutlich einfacher sind.
- Schneide Komponenten nach klaren UI-Aufgaben. Nutze Props und Komposition für gemeinsame Varianten.
- Teile wiederkehrende Bausteine wie Header, Seitenleisten, Beitragskarten, Kommentaransichten, Abstimmung und Formularfelder, sobald dies sinnvoll ist.
- Halte nur lokal benötigte Komponenten und Hilfsfunktionen beim jeweiligen Feature. Verschiebe sie in gemeinsame Bereiche, wenn sie tatsächlich gemeinsam gebraucht werden.
- Erstelle Custom Hooks für wiederkehrende zustandsbehaftete Logik. Halte einfache Hilfsfunktionen als normale Funktionen.
- Nutze verständliche Namen, explizite Props-Typen und stabile IDs als React-Keys. Vermeide unnötiges `any` und kopierte Geschäftslogik.
- Bevorzuge lokalen State. Führe globalen State oder zusätzliche State-Bibliotheken erst bei einem konkreten Bedarf ein.
- Kommentiere Gründe und nicht offensichtliche Zusammenhänge. Der Code selbst soll den normalen Ablauf erklären.

## Icons und HTTP-Anfragen

- Nutze das bereits installierte `react-icons` für Icons. Bevorzuge eine einheitliche Outline-Familie und konsistente Größen und Strichstärken.
- Verwende Icons für Navigation, Suche, Beitragsaktionen und Statusanzeigen, wenn sie Orientierung bieten. Beschrifte reine Icon-Buttons zugänglich und kennzeichne dekorative Icons entsprechend.
- Verwende Axios als Standard für HTTP-Anfragen. Es ist eine bewusste Projektpräferenz für gut lesbaren Request-Code.
- Prüfe vor der ersten Verwendung, ob Axios installiert ist; ergänze es bei Bedarf mit pnpm. Führe für diese Aufgabe allein keine künstlichen HTTP-Anfragen ein.
- Bündele wiederkehrende API-Konfiguration und Requests bei tatsächlichem Bedarf in einer kleinen, typisierten API-Schicht. Nutze die Axios-Methoden direkt und vermeide eine zusätzliche generische Request-Abstraktion.
- Verwende native `fetch`-Aufrufe nur bei einem konkreten technischen Grund, etwa einer benötigten Framework-Integration, und erläutere die Ausnahme kurz.
- Serverseitige Datenzugriffe dürfen direkt auf die jeweilige Datenquelle zugreifen. Ein direkter Datenbankzugriff benötigt keinen HTTP-Umweg über die eigene API.

## Next.js und Routing

- Verwende gemeinsame Layouts für das App-Grundgerüst und eigene Routen für Homefeed, Communitys und einzelne Beiträge beziehungsweise Threads.
- Verwende Server Components für geeignete Darstellung und Datenzugriffe. Begrenze Client Components auf Bereiche, die Interaktion, Client-State oder Browser-APIs benötigen.
- Halte Zugangsdaten, Datenbankzugriffe und vertrauliche Serverlogik außerhalb des Client-Bundles.
- Trenne Darstellung und Datenzugriff so weit, dass UI-Komponenten mit nachvollziehbaren Props arbeiten. Ergänze zusätzliche Schichten nur bei tatsächlichem Nutzen.
- Verwende die Navigation und Link-Komponenten von Next.js. Detailseiten müssen direkt per URL und nach einem Neuladen erreichbar sein.
- Lege teilbare Ansichtsparameter wie Suchbegriff, Sortierung und Filter nach Möglichkeit in der URL ab.
- Berücksichtige passende Lade-, Leer-, Fehler- und Nicht-gefunden-Zustände, sobald ein Bereich Daten lädt oder verarbeitet.
- Prüfe bei versionsabhängigen APIs die Dokumentation der installierten Next.js-Version.

## Design und Layout

- Die Gestaltung ist ruhig, sachlich und modern, mit eigener Identität.
- Die gesamte App verwendet ausschließlich ein dunkles Standarddesign. Implementiere keinen Hellmodus und keinen Theme-Umschalter. Das Betriebssystem darf keinen hellen Modus aktivieren.
- Verwende sanfte dunkle Grautöne für Hintergrund und Oberflächen. Abstufungen, dezente Trennlinien und gut lesbare helle Schrift schaffen die Hierarchie.
- Die Akzentfarbe ist ein mystisch-modernes, leicht violett getöntes Blau. Ausgangspunkt ist `#8C9DFF`, sparsam für aktive Navigation, Fokus und wichtige Aktionen eingesetzt. Bewahre konsistente vorhandene Tokens und prüfe den Kontrast.
- Verwende Source Sans 3 als gemeinsame UI-Schrift, eingebunden über `next/font/google`. Geist wird durch diese Schrift ersetzt; halte die Schrifteinbindung zentral.
- Achte auch bei sekundärem Text, Platzhaltern, Formularfeldern und deaktivierten Zuständen auf erkennbare Inhalte und Zustände.
- Pflege Farben, Abstände, Radien und Typografie zentral als Design-Tokens im gewählten Styling-System.
- Platziere Suche und Login beziehungsweise Account-Zugang in einer oben fixierten Kopfzeile. Berücksichtige ihre Höhe im Seitenlayout und bei Sprungzielen, damit sie keine Inhalte oder fokussierten Elemente verdeckt.
- Verwende auf ausreichend breiten Bildschirmen drei Spalten. Die mittlere Spalte ist breiter als jede der beiden äußeren Spalten und trägt den Hauptinhalt.
- Links ist Platz für Navigation oder andere passende Inhalte. Rechts stehen kontextbezogene Informationen, etwa Community-Beschreibung und Regeln. Die genaue Belegung darf je nach Seite variieren.
- Berücksichtige den goldenen Schnitt als gestalterische Orientierung. Lege Proportionen anhand von Lesbarkeit, sinnvollen Seitenleistenbreiten und verfügbarer Fläche fest.
- Begrenze die Gesamtbreite und Textbreite sinnvoll. Verwende konsistente Abstände statt beliebiger Einzelwerte.
- Passe das Layout an Tablet und Smartphone an. Führe Seitenleisten bei Platzmangel zusammen oder verlagere sie; wichtige Funktionen bleiben erreichbar.
- Verwende semantische Elemente, echte Links und Buttons, sichtbare Fokuszustände, beschriftete Eingaben und Tastaturbedienung. Statusinformationen dürfen nicht allein durch Farbe erkennbar sein.
- Lange Titel, Nutzernamen, Links und tiefe Kommentarzweige dürfen das Layout auch auf schmalen Bildschirmen nicht sprengen.

## Fachliches Grundmodell

- Die Plattform enthält Communitys, vergleichbar mit Subreddits. Eine Community enthält viele Beiträge. Ein Beitrag mit seiner Diskussion bildet einen Thread.
- Kommentare gehören zu einem Beitrag und können auf andere Kommentare antworten. Communitys sind selbst keine Threads.
- Homefeed, Community-Ansicht und Thread-Ansicht sind die zentralen Seitenarten.
- Vorgesehene Reddit-ähnliche Mechaniken sind Beitreten zu Communitys, Beiträge, verzweigte Kommentare, Upvotes/Downvotes, Suche und sortierbare Feeds. Die konkrete Umsetzung erfolgt mit der jeweiligen Aufgabe.
- Wenn Abstimmung umgesetzt wird: Pro Nutzer und Ziel gibt es höchstens eine aktive Stimme; Wechsel und Zurücknehmen einer Stimme müssen konsistent funktionieren.
- Wenn Ranking umgesetzt wird: Halte die Sortierung verständlich und deterministisch. Eine eigene einfache Hot-Sortierung genügt; dokumentiere ihre Bedeutung.
- Chat, Awards, komplexe Empfehlungen und umfangreiche Moderationssysteme sind mögliche spätere Erweiterungen und werden erst bei entsprechendem Auftrag ergänzt.
- Verwende für die UI-Entwicklung realistische, deterministische Beispieldaten. Halte diese klar von produktiver Persistenz getrennt und ersetze sie später an einer überschaubaren Stelle.
- Sichtbare Aktionen sollen zum jeweiligen Entwicklungsstand passen. Kennzeichne noch nicht verfügbare Aktionen eindeutig, statt einen erfolgreichen Vorgang vorzutäuschen.

## Daten und Sicherheit bei späteren Funktionen

- Validiere Nutzereingaben an der Servergrenze und prüfe Berechtigungen für geschützte Aktionen serverseitig.
- Trenne Identitätsprüfung von der Frage, welche Beiträge, Kommentare oder Communitys eine Person verändern darf.
- Verwende etablierte Lösungen für Authentifizierung. Halte Secrets aus Git, Logs und dem Browser fern.
- Rendere Nutzerinhalte sicher. Führe kein ungeprüftes HTML aus; sanitisiere erlaubte Rich-Text-Inhalte mit einer geeigneten Lösung.
- Führe Datenbank- oder Auth-Infrastruktur erst ein, wenn die beauftragte Funktion sie benötigt. Eine reine UI-Demo gilt nicht als Nachweis für funktionierende Authentifizierung oder Persistenz.

## Prüfung und Zusammenarbeit

- Kommuniziere auf Deutsch, klar und konkret. Verwende konsistente englische Bezeichner im Code.
- Triff kleine, reversible Implementierungsentscheidungen selbst. Frage bei wesentlichen offenen Produktentscheidungen oder blockierenden Unklarheiten gezielt nach.
- Halte Änderungen auf die Aufgabe fokussiert und berücksichtige vorhandene Änderungen des Nutzers.
- Als Standardabschluss genügen ausschließlich `pnpm lint` und `pnpm exec tsc --noEmit`. Falls kein Lint-Skript existiert, verwende `pnpm exec eslint .`.
- Behebe durch die Änderung entstandene Lint- und Typfehler. Führe keine zusätzliche Testsuite, keinen Build und keine weiteren Prüfabläufe ohne entsprechenden Auftrag ein.
- Berücksichtige bei Layoutänderungen Desktop und schmale Bildschirme, Überlappungen durch den fixierten Header sowie Tastaturbedienung.
- Berichte abschließend kurz, was geändert wurde, welche Prüfungen tatsächlich liefen und welche Einschränkungen noch bestehen.
- Dokumentiere Startbefehle und ausführliche Einrichtungshinweise in der README. Halte diese AGENTS.md auf Projektleitplanken und den kurzen aktuellen Umsetzungsstand konzentriert.
