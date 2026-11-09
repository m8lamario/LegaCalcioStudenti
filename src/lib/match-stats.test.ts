import { describe, expect, it } from "vitest";
import { computeCards, computeScorers } from "./match-stats";

describe("match stats", () => {
  it("sums goals from events and hides names without consent", () => {
    const scorers = computeScorers([
      {
        type: "goal",
        playerId: "1",
        teamId: "t",
        playerName: "Anna",
        playerNumber: 9,
        publicationConsent: true,
      },
      {
        type: "goal",
        playerId: "1",
        teamId: "t",
        playerName: "Anna",
        playerNumber: 9,
        publicationConsent: true,
      },
      {
        type: "goal",
        playerId: "2",
        teamId: "t",
        playerName: "Bruno",
        playerNumber: 7,
        publicationConsent: false,
      },
    ]);
    expect(scorers[0]).toMatchObject({ playerId: "1", goals: 2, name: "Anna" });
    expect(scorers[1].name).toBe("#7");
  });

  it("counts yellow and red cards", () => {
    const cards = computeCards([
      {
        type: "yellow_card",
        playerId: "1",
        teamId: "t",
        playerName: "Anna",
        publicationConsent: true,
      },
      {
        type: "red_card",
        playerId: "1",
        teamId: "t",
        playerName: "Anna",
        publicationConsent: true,
      },
    ]);
    expect(cards[0]).toMatchObject({ yellow: 1, red: 1, name: "Anna" });
  });
});
