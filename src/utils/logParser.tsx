import type { CompletedTask, UnmatchedEvent } from "./types";

/**
 * Parses a log string and extracts completed tasks, unmatched start events, and unmatched end events.
 *
 * @param log - The raw log string to parse, with each line representing a log event.
 * @returns An object containing:
 * - `completedTasks`: An array of tasks with matched START and END events, including their durations (in minutes).
 * - `unmatchedStartEvents`: An array of START events that do not have a corresponding END event.
 * - `unmatchedEndEvents`: An array of END events that do not have a corresponding START event.
 */
export const parseLogs = (
  log: string
): {
  completedTasks: CompletedTask[];
  unmatchedStartEvents: UnmatchedEvent[];
  unmatchedEndEvents: UnmatchedEvent[];
} => {
  // return if log is empty
  if (log.trim().length === 0) return { completedTasks: [], unmatchedStartEvents: [], unmatchedEndEvents: [] };

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

