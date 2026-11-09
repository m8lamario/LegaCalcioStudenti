export type LiveSubscriber = {
  subscribe(url: string, onUpdate: (data: unknown) => void): () => void;
};

const POLL_MS = 4000;

export function createPollingSubscriber(intervalMs = POLL_MS): LiveSubscriber {
  return {
    subscribe(url, onUpdate) {
      let timer: ReturnType<typeof setTimeout> | null = null;
      let stopped = false;

      const tick = async () => {
        if (stopped) return;
        if (typeof document !== "undefined" && document.hidden) return;
        try {
          const response = await fetch(url);
          if (response.ok) onUpdate(await response.json());
        } catch {
          // keep last snapshot
        }
      };

      const loop = () => {
        void tick();
        timer = setTimeout(loop, intervalMs);
      };

      const onVisibility = () => {
        if (!document.hidden) void tick();
      };

      if (typeof document !== "undefined") {
        document.addEventListener("visibilitychange", onVisibility);
      }
      loop();

      return () => {
        stopped = true;
        if (timer) clearTimeout(timer);
        if (typeof document !== "undefined") {
          document.removeEventListener("visibilitychange", onVisibility);
        }
      };
    },
  };
}

export function defaultLiveSubscriber() {
  return createPollingSubscriber();
}
