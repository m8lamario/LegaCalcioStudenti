import type { ClockAction, ClockPeriod, ClockState, MatchStatus, MinuteView } from "./types";

export const RUNNING_PERIODS: ClockPeriod[] = [
  "first",
  "second",
  "extra_first",
  "extra_second",
];

export function isClockRunning(period: ClockPeriod) {
  return RUNNING_PERIODS.includes(period);
}

export function playingSeconds(clock: ClockState, now: number): number {
  if (!isClockRunning(clock.period) || clock.periodStartedAt == null) {
    return Math.max(0, clock.elapsedSeconds);
  }
  return Math.max(0, clock.elapsedSeconds + Math.floor((now - clock.periodStartedAt) / 1000));
}

function periodLengthSeconds(clock: ClockState, period: ClockPeriod) {
  if (period === "first" || period === "second") return clock.halfMinutes * 60;
  if (period === "extra_first" || period === "extra_second") return clock.extraHalfMinutes * 60;
  return 0;
}

function regulationSeconds(clock: ClockState) {
  return clock.halfMinutes * 60 * 2;
}

export function displayMinute(clock: ClockState, now: number): MinuteView {
  if (clock.period === "idle") {
    return { minute: 1, label: "—", stoppage: 0 };
  }
  if (clock.period === "penalties") {
    return { minute: regulationSeconds(clock) / 60, label: "Rigori", stoppage: 0 };
  }
  if (clock.period === "closed") {
    const seconds = playingSeconds(clock, now);
    const minute = Math.max(1, Math.floor(seconds / 60) + (seconds % 60 === 0 && seconds > 0 ? 0 : 1));
    return { minute, label: "FT", stoppage: 0 };
  }
  if (clock.period === "interval") {
    return { minute: clock.halfMinutes, label: "HT", stoppage: 0 };
  }
  if (clock.period === "extra_interval") {
    return {
      minute: clock.halfMinutes * 2 + clock.extraHalfMinutes,
      label: "HT supp.",
      stoppage: 0,
    };
  }

  const seconds = playingSeconds(clock, now);
  const rawMinute = Math.max(1, Math.floor(seconds / 60) + 1);
  const length = periodLengthSeconds(clock, clock.period);
  const periodStartSeconds =
    clock.period === "first"
      ? 0
      : clock.period === "second"
        ? clock.halfMinutes * 60
        : clock.period === "extra_first"
          ? regulationSeconds(clock)
          : regulationSeconds(clock) + clock.extraHalfMinutes * 60;
  const periodElapsed = Math.max(0, seconds - periodStartSeconds);
  const stoppage =
    length > 0 && periodElapsed >= length
      ? Math.floor((periodElapsed - length) / 60) + 1
      : 0;
  const nominal =
    clock.period === "first"
      ? clock.halfMinutes
      : clock.period === "second"
        ? clock.halfMinutes * 2
        : clock.period === "extra_first"
          ? clock.halfMinutes * 2 + clock.extraHalfMinutes
          : clock.halfMinutes * 2 + clock.extraHalfMinutes * 2;
  if (stoppage > 0) {
    return { minute: rawMinute, label: `${nominal}+${stoppage}'`, stoppage };
  }
  return { minute: rawMinute, label: `${rawMinute}'`, stoppage: 0 };
}

function freeze(clock: ClockState, now: number): ClockState {
  if (!isClockRunning(clock.period) || clock.periodStartedAt == null) {
    return { ...clock, periodStartedAt: null };
  }
  return {
    ...clock,
    elapsedSeconds: playingSeconds(clock, now),
    periodStartedAt: null,
  };
}

export function applyClockAction(
  clock: ClockState,
  action: ClockAction,
  now: number,
): { clock: ClockState; status: MatchStatus; applied: boolean } {
  switch (action) {
    case "start": {
      if (clock.period !== "idle") {
        return { clock, status: clock.period === "closed" ? "finished" : "live", applied: false };
      }
      return {
        clock: {
          ...clock,
          period: "first",
          periodStartedAt: now,
          elapsedSeconds: 0,
        },
        status: "live",
        applied: true,
      };
    }
    case "interval": {
      if (clock.period !== "first" && clock.period !== "extra_first") {
        return { clock, status: "live", applied: false };
      }
      const frozen = freeze(clock, now);
      return {
        clock: {
          ...frozen,
          period: clock.period === "first" ? "interval" : "extra_interval",
        },
        status: "live",
        applied: true,
      };
    }
    case "resume": {
      if (clock.period !== "interval" && clock.period !== "extra_interval") {
        return { clock, status: "live", applied: false };
      }
      return {
        clock: {
          ...clock,
          period: clock.period === "interval" ? "second" : "extra_second",
          periodStartedAt: now,
        },
        status: "live",
        applied: true,
      };
    }
    case "extra": {
      if (!clock.allowExtraTime || clock.period !== "second") {
        return { clock, status: "live", applied: false };
      }
      const frozen = freeze(clock, now);
      return {
        clock: {
          ...frozen,
          period: "extra_first",
          periodStartedAt: now,
        },
        status: "live",
        applied: true,
      };
    }
    case "penalties": {
      if (
        !clock.allowPenalties ||
        (clock.period !== "second" && clock.period !== "extra_second" && clock.period !== "extra_interval")
      ) {
        return { clock, status: "live", applied: false };
      }
      const frozen = freeze(clock, now);
      return {
        clock: { ...frozen, period: "penalties" },
        status: "live",
        applied: true,
      };
    }
    case "finish": {
      if (clock.period === "idle" || clock.period === "closed") {
        return {
          clock,
          status: clock.period === "closed" ? "finished" : "scheduled",
          applied: false,
        };
      }
      const frozen = freeze(clock, now);
      return {
        clock: { ...frozen, period: "closed" },
        status: "finished",
        applied: true,
      };
    }
    case "reopen": {
      if (clock.period !== "closed") {
        return { clock, status: "finished", applied: false };
      }
      return {
        clock: {
          ...clock,
          period: clock.elapsedSeconds > 0 ? "interval" : "idle",
          periodStartedAt: null,
        },
        status: clock.elapsedSeconds > 0 ? "live" : "scheduled",
        applied: true,
      };
    }
    default:
      return { clock, status: "scheduled", applied: false };
  }
}

export function clockFromMatch(match: {
  clockPeriod: ClockPeriod;
  periodStartedAt: Date | string | null;
  elapsedSeconds: number;
  halfMinutes: number;
  extraHalfMinutes: number;
  allowExtraTime: boolean;
  allowPenalties: boolean;
}): ClockState {
  const started = match.periodStartedAt
    ? typeof match.periodStartedAt === "string"
      ? Date.parse(match.periodStartedAt)
      : match.periodStartedAt.getTime()
    : null;
  return {
    period: match.clockPeriod,
    periodStartedAt: started != null && Number.isFinite(started) ? started : null,
    elapsedSeconds: match.elapsedSeconds,
    halfMinutes: match.halfMinutes,
    extraHalfMinutes: match.extraHalfMinutes,
    allowExtraTime: match.allowExtraTime,
    allowPenalties: match.allowPenalties,
  };
}

export function estimatedServerNow(serverNow: number, receivedAt: number, now = Date.now()) {
  return serverNow + (now - receivedAt);
}
