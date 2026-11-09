export function publicPlayerName(player: {
  name?: string | null;
  number?: number | null;
  publicationConsent?: boolean | null;
}) {
  if (player.publicationConsent) return player.name?.trim() || "Giocatore";
  if (player.number != null) return `#${player.number}`;
  return "Giocatore";
}
