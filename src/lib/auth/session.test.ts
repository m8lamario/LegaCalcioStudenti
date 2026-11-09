import { describe, expect, it } from "vitest";
import { canManageMatches } from "./access";

describe("match permissions", () => {
  it("lets a referee manage only assigned cities", () => {
    const user = {
      role: "refertista" as const,
      cityIds: ["city-a"],
    };
    expect(canManageMatches(user, "city-a")).toBe(true);
    expect(canManageMatches(user, "city-b")).toBe(false);
  });
});
