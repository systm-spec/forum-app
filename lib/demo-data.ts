// Feste UI-Daten; spätere Persistenz kann an dieser Stelle angebunden werden.
export type Community = {
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
};

export type Post = {
  id: string;
  communitySlug: string;
  author: string;
  age: string;
  title: string;
  body: string;
  score: number;
  commentCount: number;
};

export type Comment = {
  id: string;
  postId: string;
  parentId: string | null;
  author: string;
  age: string;
  body: string;
  score: number;
};

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

export const posts: Post[] = [
  {
    id: "kleine-projekte",
    communitySlug: "werkstatt",
    author: "mira",
    age: "vor 2 Std.",
    title: "Welche kleinen Projekte haben euch zuletzt etwas Neues beigebracht?",
    body: "Ich habe am Wochenende eine alte Lampe repariert. Das Ergebnis war unspektakulär, aber die Suche nach dem eigentlichen Fehler hat überraschend viel Spaß gemacht. Was war euer letztes kleines Lernprojekt?",
    score: 42,
    commentCount: 4,
  },
  {
    id: "morgenroutine",
    communitySlug: "alltag",
    author: "tariq",
    age: "vor 5 Std.",
    title: "Eine ruhigere Morgenroutine ohne festen Stundenplan",
    body: "Ich versuche seit ein paar Wochen, den Tag mit zehn Minuten ohne Bildschirm zu beginnen. Kein großes System, nur ein kurzer Moment zum Ankommen. Welche einfachen Gewohnheiten funktionieren für euch?",
    score: 28,
    commentCount: 2,
  },
  {
    id: "buchnotizen",
    communitySlug: "lesezeichen",
    author: "jule",
    age: "gestern",
    title: "Wie haltet ihr Gedanken aus Büchern fest, ohne das Lesen zu unterbrechen?",
    body: "Mein Stapel mit Notizzetteln wächst schneller als meine eigentlichen Notizen. Ich suche eine Methode, die leicht genug ist, dass ich auch wirklich dabeibleibe.",
    score: 19,
    commentCount: 3,
  },
  {
    id: "arbeitsplatz",
    communitySlug: "werkstatt",
    author: "noah",
    age: "vor 2 Tagen",
    title: "Ein aufgeräumter Arbeitsplatz mit wenig Platz",
    body: "Meine kleine Ecke zu Hause soll gleichzeitig Platz für Elektronik und Papierarbeiten bieten. Habt ihr Ideen für flexible Aufbewahrung, die nicht gleich den ganzen Raum einnimmt?",
    score: 16,
    commentCount: 1,
  },
];

export const comments: Comment[] = [
  { id: "c1", postId: "kleine-projekte", parentId: null, author: "noah", age: "vor 1 Std.", body: "Ich habe einen kaputten Kopfhörer geöffnet und zum ersten Mal selbst ein Kabel neu verlötet. Der schwierigste Teil war tatsächlich das Gehäuse wieder zu schließen.", score: 11 },
  { id: "c2", postId: "kleine-projekte", parentId: "c1", author: "mira", age: "vor 50 Min.", body: "Das kenne ich. Bei meiner Lampe war das Zusammenbauen auch die eigentliche Geduldsprobe.", score: 6 },
  { id: "c3", postId: "kleine-projekte", parentId: "c2", author: "noah", age: "vor 32 Min.", body: "Immerhin weiß man beim nächsten Mal schon, welche Schraube wohin gehört.", score: 4 },
  { id: "c4", postId: "kleine-projekte", parentId: null, author: "jule", age: "vor 25 Min.", body: "Ich habe ein kleines Regal gebaut. Dabei gelernt: Zweimal messen lohnt sich wirklich.", score: 8 },
  { id: "c5", postId: "morgenroutine", parentId: null, author: "mira", age: "vor 3 Std.", body: "Ich bereite abends meinen Tee für morgens vor. Klingt klein, macht den Start aber viel entspannter.", score: 7 },
  { id: "c6", postId: "morgenroutine", parentId: "c5", author: "tariq", age: "vor 2 Std.", body: "Das probiere ich morgen aus. Danke für die Idee!", score: 3 },
  { id: "c7", postId: "buchnotizen", parentId: null, author: "eli", age: "gestern", body: "Ich markiere nur Stellen und schreibe nach jedem Kapitel drei Sätze dazu. So bleibt der Lesefluss erhalten.", score: 9 },
  { id: "c8", postId: "buchnotizen", parentId: "c7", author: "jule", age: "gestern", body: "Drei Sätze sind eine gute Grenze. Das klingt machbar.", score: 4 },
  { id: "c9", postId: "buchnotizen", parentId: null, author: "tariq", age: "vor 20 Std.", body: "Ein Lesezeichen mit Platz für ein Stichwort reicht mir oft schon.", score: 5 },
  { id: "c10", postId: "arbeitsplatz", parentId: null, author: "eli", age: "gestern", body: "Eine flache Werkzeugbox unter dem Tisch spart bei mir am meisten Platz.", score: 4 },
];
