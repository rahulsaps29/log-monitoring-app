import { render, screen, waitFor,  } from "@testing-library/react";
import "@testing-library/jest-dom";
import LogMonitorComponent from "./LogMonitorComponent";
import { expect, vi, type Mock } from "vitest";
import { parseLogs } from "../utils/logParser";

// Mock dependencies
vi.mock("../utils/logParser", () => ({
    parseLogs: vi.fn(),
}));
vi.mock("../utils/utils", () => ({
    addWarningErrorClass: vi.fn(() => ""),
    formatDuration: vi.fn((d) => `${d}ms`),
}));

describe("LogMonitorComponent", () => {
    const mockCompletedTasks = [
        {
            taskName: "TaskA",
            pid: 123,
            duration: 1000,
        },
        {
            taskName: "TaskB",
            pid: 456,
            duration: 2000,
        },
    ];
    const mockUnmatchedStartEvents = [
        {
            taskName: "TaskC",
            pid: 789,
            timestamp: new Date("2024-01-01T10:00:00Z"),
        },
    ];
    const mockUnmatchedEndEvents = [
        {
            taskName: "TaskD",
            pid: 321,
            timestamp: new Date("2024-01-01T11:00:00Z"),
        },
    ];

    beforeEach(() => {
        // @ts-ignore
        global.fetch = vi.fn(() =>
            Promise.resolve({
                text: () => Promise.resolve("log file content"),
            })
        );
        (parseLogs as Mock).mockReturnValue({
            completedTasks: [],
            unmatchedStartEvents: [],
            unmatchedEndEvents: [],
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders dashboard title", async () => {
        render(<LogMonitorComponent />);
        expect(await screen.findByText("Log Parser Dashboard")).toBeInTheDocument();
    });

    it("shows 'No completed tasks found.' when no completed tasks", async () => {
        render(<LogMonitorComponent />);
        expect(await screen.findByText("No completed tasks found.")).toBeInTheDocument();
    });

    it("shows completed tasks when present", async () => {
        (parseLogs as Mock).mockReturnValue({
            completedTasks: mockCompletedTasks,
            unmatchedStartEvents: [],
            unmatchedEndEvents: [],
        });
        render(<LogMonitorComponent />);
        for (const task of mockCompletedTasks) {
            await waitFor(() => {
                expect(screen.getByText(`Task: ${task.taskName}`)).toBeInTheDocument();
                expect(screen.getByText(`PID: ${task.pid}`)).toBeInTheDocument();
                expect(screen.getByText(`${task.duration}ms`)).toBeInTheDocument();
            });
        }
    });

    it("shows 'No unmatched events found.' when no unmatched events", async () => {
        render(<LogMonitorComponent />);
        expect(await screen.findByText("No unmatched events found.")).toBeInTheDocument();
    });

    it("shows unmatched start and end events when present", async () => {
        (parseLogs as Mock).mockReturnValue({
            completedTasks: [],
            unmatchedStartEvents: mockUnmatchedStartEvents,
            unmatchedEndEvents: mockUnmatchedEndEvents,
        });
        render(<LogMonitorComponent />);
        await waitFor(() => {
            expect(screen.getByText("Unmatched Start Events (Still running)")).toBeInTheDocument();
            expect(screen.getByText("Unmatched End Events (Missing start)")).toBeInTheDocument();
            expect(
                screen.getByText(/PID: 789/i)
            ).toBeInTheDocument();
        });
    });
});