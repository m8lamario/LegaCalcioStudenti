import { describe, expect, it } from "vitest";
import {
  enqueueCommand,
  markOffline,
  markSending,
  markSynced,
  nextToSend,
  pendingCount,
  syncLabel,
} from "./queue";
import type { QueuedCommand } from "./types";

function cmd(id: string, status: QueuedCommand["status"] = "queued"): QueuedCommand {
  return {
    clientId: id,
    matchId: "m1",
    kind: "event.add",
    payload: { type: "goal" },
    status,
    createdAt: Number(id),
  };
}

describe("offline command queue", () => {
  it("keeps FIFO order and skips duplicate client ids", () => {
    let queue = enqueueCommand([], cmd("1"));
    queue = enqueueCommand(queue, cmd("2"));
    queue = enqueueCommand(queue, cmd("1"));
    expect(queue.map((item) => item.clientId)).toEqual(["1", "2"]);
    expect(nextToSend(queue)?.clientId).toBe("1");
  });

  it("sends the head, then the next after sync", () => {
    let queue = [cmd("1"), cmd("2")];
    queue = markSending(queue, "1");
    expect(nextToSend(queue)?.clientId).toBe("2");
    queue = markSynced(queue, "1");
    expect(nextToSend(queue)?.clientId).toBe("2");
    expect(pendingCount(queue)).toBe(1);
  });

  it("marks in-flight work offline and reports sync state", () => {
    let queue = markSending([cmd("1")], "1");
    queue = markOffline(queue);
    expect(queue[0]?.status).toBe("offline");
    expect(syncLabel(queue, false)).toBe("offline");
    expect(syncLabel([], true)).toBe("synced");
  });
});
