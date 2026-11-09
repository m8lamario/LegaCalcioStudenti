import { ImageResponse } from "next/og";
import { getCupTeamPage } from "@/lib/queries/cup";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Squadra della Lega Calcio Studenti";

export default async function TeamOgImage({
  params,
}: {
  params: Promise<{ slug: string; team: string }>;
}) {
  const { slug, team } = await params;
  const data = await getCupTeamPage(slug, team);
  const title = data?.team.name ?? "Squadra";
  const subtitle = data?.competition.name ?? "Lega Calcio Studenti";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 72,
          background: "#0E1016",
          color: "#F4F6F8",
        }}
      >
        <div style={{ color: "#00EDAF", fontSize: 28, letterSpacing: 4, textTransform: "uppercase" }}>
          {subtitle}
        </div>
        <div style={{ fontSize: 72, lineHeight: 1.05, marginTop: 16 }}>{title}</div>
      </div>
    ),
    size,
  );
}
