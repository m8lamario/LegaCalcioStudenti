import type { ReactNode } from "react";

const KEPT_COMPOUNDS = ["inter-scolastici"];

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const COMPOUND_PATTERN = new RegExp(`(${KEPT_COMPOUNDS.map(escapeRegExp).join("|")})`, "gi");

export function withKeptCompounds(text: string, className: string): ReactNode {
  if (!text) return text;
  const parts = text.split(COMPOUND_PATTERN);
  if (parts.length === 1) return text;

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
