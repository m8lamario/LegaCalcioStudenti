import type { LiveCommandKind, QueuedCommand, QueueStatus } from "./types";

export function enqueueCommand(
  queue: QueuedCommand[],
  command: Omit<QueuedCommand, "status"> & { status?: QueueStatus },
): QueuedCommand[] {
  if (queue.some((item) => item.clientId === command.clientId)) {
    return queue;
  }
  return [
    ...queue,
    {
      ...command,
      status: command.status ?? "queued",
    },
  ];
}

export function nextToSend(queue: QueuedCommand[]): QueuedCommand | null {
  return (
    queue.find((item) => item.status === "queued" || item.status === "offline") ?? null
  );
}

export function markSending(queue: QueuedCommand[], clientId: string): QueuedCommand[] {
  return queue.map((item) =>
    item.clientId === clientId ? { ...item, status: "sending" } : item,
  );
}

export function markSynced(queue: QueuedCommand[], clientId: string): QueuedCommand[] {
  return queue.map((item) =>
    item.clientId === clientId ? { ...item, status: "synced" } : item,
  );
}

export function markOffline(queue: QueuedCommand[]): QueuedCommand[] {
  return queue.map((item) =>
    item.status === "sending" || item.status === "queued"
      ? { ...item, status: "offline" }
      : item,
  );
}

export function pendingCount(queue: QueuedCommand[]) {
  return queue.filter((item) => item.status !== "synced").length;
}

export function syncLabel(queue: QueuedCommand[], online: boolean): QueueStatus | "synced" {
  if (!online) return "offline";
  if (queue.some((item) => item.status === "sending")) return "sending";
  if (queue.some((item) => item.status === "queued" || item.status === "offline")) return "queued";
  return "synced";
}

export function createQueuedCommand(input: {
  matchId: string;
  kind: LiveCommandKind;
  payload?: Record<string, unknown>;
  now?: number;
  clientId?: string;
}): Omit<QueuedCommand, "status"> {
  return {
    clientId: input.clientId ?? crypto.randomUUID(),
    matchId: input.matchId,
    kind: input.kind,
    payload: input.payload ?? {},
    createdAt: input.now ?? Date.now(),
  };
}
