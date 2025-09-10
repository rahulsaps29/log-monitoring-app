import { describe, it, expect } from "vitest";
import { parseLogs } from "./logParser";

describe("parseLogs", () => {
  it("parses completed tasks with matching START and END events", () => {
    const log = `
      09:00:00, TaskA, START, 1
      09:10:00, TaskA, END, 1
    `;
    const { completedTasks, unmatchedEvents } = parseLogs(log);

    expect(completedTasks).toHaveLength(1);
    expect(completedTasks[0]).toMatchObject({
      taskName: "TaskA",
      pid: "1",
      duration: 10,
    });
    expect(unmatchedEvents).toHaveLength(0);
  });

  it("returns unmatched START events with no corresponding END", () => {
    const log = `
      09:00:00, TaskA, START, 1
      09:05:00, TaskB, START, 2
      09:10:00, TaskA, END, 1
    `;
    const { completedTasks, unmatchedEvents } = parseLogs(log);

    expect(completedTasks).toHaveLength(1);
    expect(completedTasks[0].taskName).toBe("TaskA");
    expect(unmatchedEvents).toHaveLength(1);
    expect(unmatchedEvents[0]).toMatchObject({
      taskName: "TaskB",
      pid: "2",
    });
  });

  it("returns unmatched END events with no corresponding START", () => {
    const log = `
      09:10:00, TaskA, END, 1
      09:15:00, TaskB, END, 2
      09:20:00, TaskC, START, 3
    `;
    const { completedTasks, unmatchedEvents } = parseLogs(log);

    expect(completedTasks).toHaveLength(0);
    expect(unmatchedEvents).toHaveLength(1);
    expect(unmatchedEvents[0].taskName).toBe("TaskC");
  });

  it("handles multiple completed tasks and sorts by duration", () => {
    const log = `
      09:00:00, TaskA, START, 1
      09:05:00, TaskB, START, 2
      09:10:00, TaskA, END, 1
      09:20:00, TaskB, END, 2
    `;
    const { completedTasks } = parseLogs(log);

    expect(completedTasks).toHaveLength(2);
    expect(completedTasks[0].taskName).toBe("TaskA");
    expect(completedTasks[1].taskName).toBe("TaskB");
    expect(completedTasks[0].duration).toBeLessThan(completedTasks[1].duration);
  });

  it("handles empty log", () => {
    const log = "";
    const { completedTasks, unmatchedEvents } = parseLogs(log);

    expect(completedTasks).toHaveLength(0);
    expect(unmatchedEvents).toHaveLength(0);
  });

  it("handles logs with extra whitespace", () => {
    const log = `
      09:00:00 , TaskA , START , 1
      09:10:00 , TaskA , END , 1
    `;
    const { completedTasks } = parseLogs(log);

    expect(completedTasks).toHaveLength(1);
    expect(completedTasks[0].taskName).toBe("TaskA");
    expect(completedTasks[0].duration).toBe(10);
  });

  it("handles multiple unmatched START and END events", () => {
    const log = `
      09:00:00, TaskA, START, 1
      09:05:00, TaskB, START, 2
      09:10:00, TaskC, END, 3
      09:15:00, TaskD, END, 4
    `;
    const { completedTasks, unmatchedEvents } = parseLogs(log);

    expect(completedTasks).toHaveLength(0);
    expect(unmatchedEvents).toHaveLength(2);
    expect(unmatchedEvents.map(e => e.taskName)).toEqual(["TaskA", "TaskB"]);
  });
});