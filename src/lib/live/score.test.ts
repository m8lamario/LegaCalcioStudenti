import { describe, expect, it } from "vitest";
import { computeMatchScore, scorersAfterClose, standingsAfterClose } from "./score";

const home = "home";
const away = "away";

describe("live score", () => {
  it("counts goals, own goals and in-play penalties", () => {
    const score = computeMatchScore(
      [
        { type: "goal", teamId: home, goalKind: "regular" },
        { type: "goal", teamId: home, goalKind: "penalty" },
        { type: "goal", teamId: home, goalKind: "own_goal" },
        { type: "goal", teamId: away, goalKind: "regular" },
      ],
      home,
      away,
    );
    expect(score).toEqual({
      homeScore: 2,
      awayScore: 2,
      homePenaltyScore: 0,
      awayPenaltyScore: 0,
    });
  });

  it("keeps shootout goals off the match score", () => {
    const score = computeMatchScore(
      [
        { type: "goal", teamId: home, goalKind: "penalty", shootout: true },
        { type: "goal", teamId: away, goalKind: "penalty", shootout: true },
        { type: "goal", teamId: home, goalKind: "penalty", shootout: true },
      ],
      home,
      away,
    );
    expect(score.homeScore).toBe(0);
    expect(score.awayScore).toBe(0);
    expect(score.homePenaltyScore).toBe(2);
    expect(score.awayPenaltyScore).toBe(1);
  });

  it("ignores undone events", () => {
    const score = computeMatchScore(
      [
        { type: "goal", teamId: home, goalKind: "regular" },
        { type: "goal", teamId: home, goalKind: "regular", deletedAt: "2026-01-01" },
      ],
      home,
      away,
    );
    expect(score.homeScore).toBe(1);
  });

  it("feeds closed matches into standings and scorers", () => {
    const standings = standingsAfterClose(
      [
        { id: home, name: "Casa" },
        { id: away, name: "Trasferta" },
      ],
      [
        {
          homeTeamId: home,
          awayTeamId: away,
          homeScore: 2,
          awayScore: 1,
          status: "finished",
        },
      ],
    );
    expect(standings[0]?.teamId).toBe(home);
    expect(standings[0]?.points).toBe(3);

    const scorers = scorersAfterClose([
      {
        type: "goal",
        playerId: "p1",
        teamId: home,
        playerName: "Anna",
        publicationConsent: true,
        goalKind: "regular",
        shootout: false,
      },
      {
        type: "goal",
        playerId: "p1",
        teamId: home,
        playerName: "Anna",
        publicationConsent: true,
        goalKind: "own_goal",
        shootout: false,
      },
    ]);
    expect(scorers[0]?.goals).toBe(1);
  });
});
