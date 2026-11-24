import type { ReactNode } from "react";

const KEPT_COMPOUNDS = ["inter-scolastici"];

const SHORT_WORDS = [
  "l'",
  "d'",
  "dell'",
  "all'",
  "nell'",
  "sull'",
  "un'",
  "il",
  "lo",
  "la",
  "le",
  "gli",
  "i",
  "un",
  "una",
  "uno",
  "del",
  "della",
  "dello",
  "dei",
  "degli",
  "delle",
  "al",
  "alla",
  "allo",
  "ai",
  "alle",
  "nel",
  "nella",
  "nello",
  "nei",
  "nelle",
  "sul",
  "sulla",
  "sui",
  "sugli",
  "sulle",
  "di",
  "da",
  "a",
  "in",
  "con",
  "su",
  "per",
  "tra",
  "fra",
  "e",
  "o",
  "ma",
  "se",
  "che",
].sort((a, b) => b.length - a.length);

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const COMPOUND_PATTERN = new RegExp(`(${KEPT_COMPOUNDS.map(escapeRegExp).join("|")})`, "gi");

const SHORT_WORD_PATTERN = new RegExp(
  `(?<=^|[\\s.!?…«"'“‘(])(?:${SHORT_WORDS.map(escapeRegExp).join("|")})\\s+(?=\\S)`,
  "gi",
);

const LAST_WORDS_PATTERN = /(\S+)\s+(\S+)([.!?…]*)(?=\s+[A-ZÀ-Ú]|$)/g;

/** Evita a capo dopo articoli e preposizioni corte, e una parola sola a fine frase. */
export function withKeptLines(text: string): string {
  if (!text) return text;
  return text
    .replace(SHORT_WORD_PATTERN, (chunk) => `${chunk.trimEnd()}\u00a0`)
    .replace(LAST_WORDS_PATTERN, "$1\u00a0$2$3");
}

/** Se una nuova frase non ci sta sulla riga, scende intera invece di lasciare una parola sopra. */
export function withKeptSentences(text: string, className = "lcs-sentence"): ReactNode {
  if (!text) return text;
  const sentences = text.trim().split(/(?<=[.!?…])\s+/);
  if (sentences.length <= 1) return withKeptLines(text);

  return sentences.map((sentence, index) => (
    <span key={`${sentence}-${index}`} className={className}>
      {withKeptLines(sentence)}
      {index < sentences.length - 1 ? " " : ""}
    </span>
  ));
}

export function withKeptCompounds(text: string, className: string): ReactNode {
  const prepared = withKeptLines(text);
  if (!prepared) return prepared;
  const parts = prepared.split(COMPOUND_PATTERN);
  if (parts.length === 1) return prepared;

  return parts.map((part, index) =>
    KEPT_COMPOUNDS.some((word) => word.toLowerCase() === part.toLowerCase()) ? (
      <span key={`${part}-${index}`} className={className}>
        {part}
      </span>
    ) : (
      part
    ),
  );
}
