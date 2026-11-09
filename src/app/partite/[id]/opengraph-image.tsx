import { ImageResponse } from "next/og";
import { getMatchPage } from "@/lib/queries/cup";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Partita della Lega Calcio Studenti";

export default async function MatchOgImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getMatchPage(id);
  const home = data?.match.homeTeam?.name ?? "Casa";
  const away = data?.match.awayTeam?.name ?? "Trasferta";
  const score =
    data?.match.homeScore != null && data?.match.awayScore != null
      ? `${data.match.homeScore} - ${data.match.awayScore}`
      : "Lega Calcio Studenti";
  const statusLabel = data?.match.status === "finished" ? "FINALE" : data?.match.status === "live" ? "LIVE" : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "#0E1016",
          color: "#F4F6F8",
        }}
      >
        <div style={{ color: "#00EDAF", fontSize: 24, letterSpacing: 4, textTransform: "uppercase" }}>
          {data?.competition.name ?? "Lega Calcio Studenti"}
        </div>
        <div style={{ fontSize: 56, lineHeight: 1.1, marginTop: 20 }}>
          {home} vs {away}
        </div>
        <div style={{ fontSize: 72, color: "#00EDAF", marginTop: 24 }}>{score}</div>
        {statusLabel ? (
          <div style={{ marginTop: 16, letterSpacing: 6, fontSize: 22, color: "#9AA3B0" }}>
            {statusLabel}
          </div>
        ) : null}
      </div>
    ),
    size,
  );
}
