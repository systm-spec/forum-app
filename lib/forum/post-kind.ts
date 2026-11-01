import type { PostKind } from "./types";

export const postKindLabels: Record<PostKind, string> = {
  question: "Frage",
  thesis: "These",
  solution: "Lösungsansatz",
};

export const postKindHints: Record<PostKind, string> = {
  question: "Was genau soll geklärt werden? Welcher Kontext ist wichtig?",
  thesis: "Welche Aussage vertrittst du? Wie begründest du sie?",
  solution: "Welches Problem möchtest du lösen? Wie soll der Vorschlag funktionieren?",
};
