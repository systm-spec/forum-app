export type Community = { slug: string; name: string; description: string; shortDescription: string };

export const communities: Community[] = [
  {
    slug: "werkstatt",
    name: "Werkstatt",
    description: "Ein Raum für Projekte, kleine Experimente und die Fragen dazwischen.",
    shortDescription: "Ideen und Projekte",
  },
  {
    slug: "alltag",
    name: "Alltag",
    description: "Was den Tag leichter macht: Routinen, Beobachtungen und praktische Tipps.",
    shortDescription: "Leben und Routinen",
  },
  {
    slug: "lesezeichen",
    name: "Lesezeichen",
    description: "Bücher, Artikel und Gedanken, die länger im Kopf bleiben.",
    shortDescription: "Lesen und Entdecken",
  },
];
