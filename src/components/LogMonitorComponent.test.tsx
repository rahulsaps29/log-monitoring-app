import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"
import { vi, type Mock } from "vitest";
import LogMonitorComponent from "./LogMonitorComponent";
import { parseLogs } from "../utils/logParser";

// Mock dependencies
vi.mock("../utils/logParser", () => ({
  parseLogs: vi.fn(),
}));
vi.mock("./CompletedTaskComponent/CompletedTaskComponent", () => ({
  default: ({ task }: any) => <div data-testid="completed-task">{task.taskName}</div>,
}));

describe("LogMonitorComponent", () => {
  const mockCompletedTasks = [
    { taskName: "Task 1", pid: 123, startTime: new Date(), endTime: new Date() },
    { taskName: "Task 2", pid: 456, startTime: new Date(), endTime: new Date() },
  ];
  const mockUnmatchedEvents = [
    { taskName: "Unmatched Task", pid: 789, timestamp: new Date() },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
    // @ts-ignore
    global.fetch = vi.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve("mock log content"),
      })
    );
  });

  it("renders completed tasks and unmatched events from parsed logs", async () => {
    const { parseLogs } = await import("../utils/logParser");
    (parseLogs as Mock).mockReturnValue({
      completedTasks: mockCompletedTasks,
      unmatchedEvents: mockUnmatchedEvents,
    });

    render(<LogMonitorComponent />);

    await waitFor(() => {
      expect(screen.getByText("Log Parser Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Completed Tasks")).toBeInTheDocument();
      expect(screen.getByText("Unmatched Events")).toBeInTheDocument();
    });

    // Completed tasks rendered
    expect(screen.getAllByTestId("completed-task")).toHaveLength(2);
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();

    // Unmatched events rendered
    expect(screen.getByText("Unmatched Start Events (Still running)")).toBeInTheDocument();
    expect(screen.getByText(/Unmatched Task/)).toBeInTheDocument();
    expect(screen.getByText(/PID: 789/)).toBeInTheDocument();
    expect(screen.getByText(/started at/)).toBeInTheDocument();
  });

  it("shows no data messages when no completed tasks or unmatched events", async () => {
    (parseLogs as Mock).mockReturnValue({
      completedTasks: [],
      unmatchedEvents: [],
    });

    render(<LogMonitorComponent />);

    await waitFor(() => {
      expect(screen.getByText("No completed tasks found.")).toBeInTheDocument();
      expect(screen.getByText("No unmatched events found.")).toBeInTheDocument();
    });
  });

  it("fetches logs on mount and calls parseLogs", async () => {
    (parseLogs as Mock).mockReturnValue({
      completedTasks: [],
      unmatchedEvents: [],
    });

    render(<LogMonitorComponent />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/logs.log");
      expect(parseLogs).toHaveBeenCalledWith("mock log content");
    });
  });
});