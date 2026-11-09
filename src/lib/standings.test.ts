import { describe, expect, it } from "vitest";
import { computeStandings, DEFAULT_STANDINGS_RULES } from "./standings";

const teams = [
  { id: "a", name: "Alfa" },
  { id: "b", name: "Beta" },
  { id: "c", name: "Gamma" },
  { id: "d", name: "Delta" },
];

describe("computeStandings", () => {
  it("assigns 3/1/0 and ranks by points", () => {
    const table = computeStandings(teams, [
      { homeTeamId: "a", awayTeamId: "b", homeScore: 2, awayScore: 0, status: "finished" },
      { homeTeamId: "c", awayTeamId: "d", homeScore: 1, awayScore: 1, status: "finished" },
    ]);
    expect(table[0]).toMatchObject({ teamId: "a", points: 3, won: 1, goalDiff: 2 });
    expect(table.find((row) => row.teamId === "c")?.points).toBe(1);
    expect(table.find((row) => row.teamId === "b")?.points).toBe(0);
  });

  it("ignores matches that are not finished", () => {
    const table = computeStandings(teams, [
      { homeTeamId: "a", awayTeamId: "b", homeScore: 5, awayScore: 0, status: "live" },
      { homeTeamId: "a", awayTeamId: "c", homeScore: 1, awayScore: 0, status: "scheduled" },
    ]);
    expect(table.every((row) => row.played === 0)).toBe(true);
  });

  it("breaks ties with head to head then goal difference", () => {
    const table = computeStandings(
      [
        { id: "a", name: "Alfa" },
        { id: "b", name: "Beta" },
        { id: "c", name: "Gamma" },
      ],
      [
        { homeTeamId: "a", awayTeamId: "b", homeScore: 0, awayScore: 1, status: "finished" },
        { homeTeamId: "a", awayTeamId: "c", homeScore: 5, awayScore: 0, status: "finished" },
      ],
    );
    expect(table[0].teamId).toBe("b");
    expect(table[0].points).toBe(table[1].points);
    expect(table[1].teamId).toBe("a");
    expect(table[1].goalDiff).toBeGreaterThan(table[0].goalDiff);
  });

  it("uses alphabetical order as last tie breaker", () => {
    const table = computeStandings(
      [
        { id: "b", name: "Beta" },
        { id: "a", name: "Alfa" },
      ],
      [],
      DEFAULT_STANDINGS_RULES,
    );
    expect(table.map((row) => row.teamName)).toEqual(["Alfa", "Beta"]);
  });

  it("uses custom point values", () => {
    const table = computeStandings(
      teams.slice(0, 2),
      [{ homeTeamId: "a", awayTeamId: "b", homeScore: 1, awayScore: 1, status: "finished" }],
      { winPoints: 3, drawPoints: 2, lossPoints: 0, tieBreakers: ["points", "name"] },
    );
    expect(table[0].points).toBe(2);
  });
});
