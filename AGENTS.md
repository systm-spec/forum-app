<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

# Projektanweisungen
## Ziel und Arbeitsumfang

Entwickle eine eigenständige Community- und Forum-Webapp mit Reddit-ähnlichen
Mechaniken, eigener visueller Identität und sauber nachvollziehbarem Code.
Das Projekt dient als Portfolio-Projekt und soll später nutzbar sein können.

- Zuerst werden Grunddesign, gemeinsames Layout und wiederverwendbare UI-Bausteine umgesetzt. Danach folgen die fachlichen Funktionen schrittweise.
- Setze die jeweils beauftragte Aufgabe vollständig um. Diese Datei ist kein Auftrag, sämtliche erwähnten Funktionen gleichzeitig zu bauen.
- Erstelle Wireframes oder zusätzliche Designvorschauen nur auf ausdrücklichen Wunsch.
- Halte die Architektur dem Umfang eines Forums angemessen: klare Zuständigkeiten, kurze nachvollziehbare Wege und wenige Abstraktionsebenen.
- Datenbank, Auth-Anbieter, Hosting, endgültiger Name, Logo und Akzentfarbe sind noch offen. Lege sie nicht beiläufig als verbindliche Projektentscheidungen fest. Verwende bei Bedarf klar erkennbare Platzhalter.
Stack und Versionen
- Verwende Next.js mit App Router, React und TypeScript mit strenger Typprüfung.
- Nutze beim Projektstart die aktuellen stabilen, miteinander kompatiblen Versionen von Next.js und React. Prüfe Versionen und Kompatibilität anhand offizieller Dokumentation und Paketmetadaten; rate keine Versionsnummern.
- Falls sich die neueste stabile React-Version noch nicht mit der neuesten stabilen Next.js-Version kombinieren lässt, benenne den Konflikt und wähle eine offiziell unterstützte Kombination.
- Halte den Stack aktuell. Behandle größere Versionswechsel als eigene Wartungsaufgabe mit Prüfung der Migration und Auswirkungen.
- Verwende pnpm und pflege die zugehörige Lockdatei. Nutze die im Projekt festgelegte Node.js-Version und Paketmanager-Version.
- Prüfe vor Änderungen vorhandene Dateien, Skripte und Konventionen. Ergänze neue Abhängigkeiten nur für einen konkreten Bedarf.
React und Code-Stil
- Bevorzuge benannte Exporte und Arrow Functions: export const Component = (...) => ....
- Verwende die vom Framework benötigten Exporte. Für eine Next.js-Seite ist beispielsweise const Page = (...) => ...; export default Page; sinnvoll. Nutze andere Funktionsformen, wenn sie technisch erforderlich oder deutlich einfacher sind.
- Schneide Komponenten nach klaren UI-Aufgaben. Nutze Props und Komposition für gemeinsame Varianten.
- Teile wiederkehrende Bausteine wie Header, Seitenleisten, Beitragskarten, Kommentaransichten, Abstimmung und Formularfelder, sobald dies sinnvoll ist.
- Halte nur lokal benötigte Komponenten und Hilfsfunktionen beim jeweiligen Feature. Verschiebe sie in gemeinsame Bereiche, wenn sie tatsächlich gemeinsam gebraucht werden.
- Erstelle Custom Hooks für wiederkehrende zustandsbehaftete Logik. Halte einfache Hilfsfunktionen als normale Funktionen.
- Nutze verständliche Namen, explizite Props-Typen und stabile IDs als React-Keys. Vermeide unnötiges any und kopierte Geschäftslogik.
- Bevorzuge lokalen State. Führe globalen State oder zusätzliche State-Bibliotheken erst bei einem konkreten Bedarf ein.
- Kommentiere Gründe und nicht offensichtliche Zusammenhänge. Der Code selbst soll den normalen Ablauf erklären.
Next.js und Routing
- Verwende gemeinsame Layouts für das App-Grundgerüst und eigene Routen für Homefeed, Communitys und einzelne Beiträge beziehungsweise Threads.
- Verwende Server Components für geeignete Darstellung und Datenzugriffe. Begrenze Client Components auf Bereiche, die Interaktion, Client-State oder Browser-APIs benötigen.
- Halte Zugangsdaten, Datenbankzugriffe und vertrauliche Serverlogik außerhalb des Client-Bundles.
- Trenne Darstellung und Datenzugriff so weit, dass UI-Komponenten mit nachvollziehbaren Props arbeiten. Ergänze zusätzliche Schichten nur bei tatsächlichem Nutzen.
- Verwende die Navigation und Link-Komponenten von Next.js. Detailseiten müssen direkt per URL und nach einem Neuladen erreichbar sein.
- Lege teilbare Ansichtsparameter wie Suchbegriff, Sortierung und Filter nach Möglichkeit in der URL ab.
- Berücksichtige passende Lade-, Leer-, Fehler- und Nicht-gefunden-Zustände, sobald ein Bereich Daten lädt oder verarbeitet.
- Prüfe bei versionsabhängigen APIs die Dokumentation der installierten Next.js-Version.
Design und Layout
- Die Gestaltung ist ruhig, sachlich und modern, mit eigener Identität.
- Die gesamte App verwendet ausschließlich ein dunkles Standarddesign. Implementiere keinen Hellmodus und keinen Theme-Umschalter. Das Betriebssystem darf keinen hellen Modus aktivieren.
- Verwende sanfte dunkle Grautöne für Hintergrund und Oberflächen. Abstufungen, dezente Trennlinien und gut lesbare helle Schrift schaffen die Hierarchie.
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
Fachliches Grundmodell
- Die Plattform enthält Communitys, vergleichbar mit Subreddits. Eine Community enthält viele Beiträge. Ein Beitrag mit seiner Diskussion bildet einen Thread.
- Kommentare gehören zu einem Beitrag und können auf andere Kommentare antworten. Communitys sind selbst keine Threads.
- Homefeed, Community-Ansicht und Thread-Ansicht sind die zentralen Seitenarten.
- Vorgesehene Reddit-ähnliche Mechaniken sind Beitreten zu Communitys, Beiträge, verzweigte Kommentare, Upvotes/Downvotes, Suche und sortierbare Feeds. Die konkrete Umsetzung erfolgt mit der jeweiligen Aufgabe.
- Wenn Abstimmung umgesetzt wird: Pro Nutzer und Ziel gibt es höchstens eine aktive Stimme; Wechsel und Zurücknehmen einer Stimme müssen konsistent funktionieren.
- Wenn Ranking umgesetzt wird: Halte die Sortierung verständlich und deterministisch. Eine eigene einfache Hot-Sortierung genügt; dokumentiere ihre Bedeutung.
- Chat, Awards, komplexe Empfehlungen und umfangreiche Moderationssysteme sind mögliche spätere Erweiterungen und werden erst bei entsprechendem Auftrag ergänzt.
- Verwende für die UI-Entwicklung realistische, deterministische Beispieldaten. Halte diese klar von produktiver Persistenz getrennt und ersetze sie später an einer überschaubaren Stelle.
- Sichtbare Aktionen sollen zum jeweiligen Entwicklungsstand passen. Kennzeichne noch nicht verfügbare Aktionen eindeutig, statt einen erfolgreichen Vorgang vorzutäuschen.
Daten und Sicherheit bei späteren Funktionen
- Validiere Nutzereingaben an der Servergrenze und prüfe Berechtigungen für geschützte Aktionen serverseitig.
- Trenne Identitätsprüfung von der Frage, welche Beiträge, Kommentare oder Communitys eine Person verändern darf.
- Verwende etablierte Lösungen für Authentifizierung. Halte Secrets aus Git, Logs und dem Browser fern.
- Rendere Nutzerinhalte sicher. Führe kein ungeprüftes HTML aus; sanitisiere erlaubte Rich-Text-Inhalte mit einer geeigneten Lösung.
- Führe Datenbank- oder Auth-Infrastruktur erst ein, wenn die beauftragte Funktion sie benötigt. Eine reine UI-Demo gilt nicht als Nachweis für funktionierende Authentifizierung oder Persistenz.
Prüfung und Zusammenarbeit
- Kommuniziere auf Deutsch, klar und konkret. Verwende konsistente englische Bezeichner im Code.
- Triff kleine, reversible Implementierungsentscheidungen selbst. Frage bei wesentlichen offenen Produktentscheidungen oder blockierenden Unklarheiten gezielt nach.
- Halte Änderungen auf die Aufgabe fokussiert und berücksichtige vorhandene Änderungen des Nutzers.
- Nutze die tatsächlich vorhandenen Package-Skripte für relevante Prüfungen wie Linting, Typprüfung, Tests und Build. Ergänze fehlende Skripte nur, wenn die Aufgabe sie benötigt.
- Prüfe Layoutänderungen nach Möglichkeit im Browser auf Desktop und schmalen Bildschirmen, einschließlich Überlappungen durch den fixierten Header und Tastaturbedienung.
- Teste fachlich relevante Risiken, beispielsweise Stimmwechsel, Kommentarzuordnung, Filter und Zugriffsrechte. Richte den Testumfang nach der Änderung aus.
- Berichte abschließend kurz, was geändert wurde, welche Prüfungen tatsächlich liefen und welche Einschränkungen noch bestehen.
- Dokumentiere funktionierende Startbefehle, wichtige Entscheidungen und den aktuellen Demo-Umfang in der README, sobald sie feststehen. Halte diese AGENTS.md auf dauerhafte Projektleitplanken konzentriert.

<!-- END:nextjs-agent-rules -->

