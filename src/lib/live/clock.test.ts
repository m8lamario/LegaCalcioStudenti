import { describe, expect, it } from "vitest";
import { applyClockAction, displayMinute, estimatedServerNow, playingSeconds } from "./clock";
import type { ClockState } from "./types";

const base: ClockState = {
  period: "idle",
  periodStartedAt: null,
  elapsedSeconds: 0,
  halfMinutes: 25,
  extraHalfMinutes: 10,
  allowExtraTime: true,
  allowPenalties: true,
};

describe("live clock", () => {
  it("uses configured half length instead of 45 minutes", () => {
    const started = applyClockAction(base, "start", 1_000_000);
    const atEnd = displayMinute(started.clock, 1_000_000 + 25 * 60 * 1000);
    expect(atEnd.minute).toBe(26);
    expect(atEnd.label).toMatch(/25\+1/);
  });

  it("keeps the same minute for two clients from the same serverNow", () => {
    const started = applyClockAction(base, "start", 5_000_000);
    const now = 5_000_000 + 8 * 60 * 1000 + 12_000;
    expect(displayMinute(started.clock, now)).toEqual(displayMinute(started.clock, now));
    expect(playingSeconds(started.clock, now)).toBe(8 * 60 + 12);
  });

  it("pauses at half-time and resumes the second half", () => {
    const t0 = 10_000_000;
    const first = applyClockAction(base, "start", t0);
    const ht = applyClockAction(first.clock, "interval", t0 + 25 * 60 * 1000);
    expect(ht.clock.period).toBe("interval");
    expect(displayMinute(ht.clock, t0 + 30 * 60 * 1000).label).toBe("HT");
    const second = applyClockAction(ht.clock, "resume", t0 + 30 * 60 * 1000);
    expect(second.clock.period).toBe("second");
    expect(second.applied).toBe(true);
  });

  it("starts extra time from the second half when the phase allows it", () => {
    const t0 = 20_000_000;
    let clock = applyClockAction(base, "start", t0).clock;
    clock = applyClockAction(clock, "interval", t0 + 25 * 60 * 1000).clock;
    clock = applyClockAction(clock, "resume", t0 + 27 * 60 * 1000).clock;
    const extra = applyClockAction(clock, "extra", t0 + 52 * 60 * 1000);
    expect(extra.applied).toBe(true);
    expect(extra.clock.period).toBe("extra_first");
  });

  it("rejects a second kick-off", () => {
    const started = applyClockAction(base, "start", 1);
    const again = applyClockAction(started.clock, "start", 2);
    expect(again.applied).toBe(false);
    expect(again.clock.period).toBe("first");
  });

  it("keeps two wall clocks aligned via estimatedServerNow", () => {
    const serverNow = 1000;
    const receivedA = 1100;
    const receivedB = 1100;
    expect(estimatedServerNow(serverNow, receivedA, 2100)).toBe(
      estimatedServerNow(serverNow, receivedB, 2100),
    );
  });
});
