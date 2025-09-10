import type { CompletedTask, UnmatchedEvent } from "./types";

export const parseLogs = (
  log: string
): {
  completedTasks: CompletedTask[];
  unmatchedStartEvents: UnmatchedEvent[];
  unmatchedEndEvents: UnmatchedEvent[];
} => {
  const lines = log.trim().split("\n");
  const startEvents = new Map<string, UnmatchedEvent>();
  const completedTasks: CompletedTask[] = [];
  const unmatchedEndEvents: UnmatchedEvent[] = [];

  lines.forEach((line) => {
    const [timestampStr, taskName, eventType, pid] = line.split(",");
    const date = new Date(`2000-01-01T${timestampStr.trim()}`);
    const trimmedTaskName = taskName.trim();
    const trimmedEventType = eventType.trim();

    if (trimmedEventType === "START") {
      startEvents.set(pid.trim(), {
        taskName: trimmedTaskName,
        timestamp: date,
        pid: pid.trim(),
      });
    } else if (trimmedEventType === "END") {
      const startEvent = startEvents.get(pid.trim());
      if (startEvent) {
        const duration = date.getTime() - startEvent.timestamp.getTime();
        let durationInMinutes = parseFloat(((duration/(1000*60))%60).toFixed(2));
        completedTasks.push({
          taskName: startEvent.taskName,
          pid: startEvent.pid,
          duration: durationInMinutes,
        });
        startEvents.delete(pid.trim());
      } else {
        unmatchedEndEvents.push({
          taskName: trimmedTaskName,
          timestamp: date,
          pid: pid.trim(),
        });
      }
    }
  });

  const unmatchedStartEvents: UnmatchedEvent[] = Array.from(
    startEvents.values()
  );

  completedTasks.sort((a, b) => a.duration - b.duration);
  return { completedTasks, unmatchedStartEvents, unmatchedEndEvents };
};

export const formatDuration = (durationInMin: number): string => {
  const minutes = Math.floor(durationInMin)
  const seconds = Math.round((durationInMin - minutes) * 60)
  if (minutes > 0) {
    return `${minutes} min${minutes > 1 ? "s" : ""}${
      seconds > 0 ? ` and ${seconds} sec${seconds > 1 ? "s" : ""}` : ""
    }`;
  } else {
    return `${seconds} sec${seconds > 1 ? "s" : ""}`;
  }
}