import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CompletedTaskComponent from "./CompletedTaskComponent";
import type { CompletedTask } from "../../utils/types";
import { vi } from "vitest";

// Mock utils
vi.mock("../../utils/utils", async () => {
  const actual = await vi.importActual<any>("../../utils/utils");
  return {
    ...actual,
    addWarningErrorClass: vi.fn((duration: number) => (duration > 100 ? "warning" : "")),
    formatDuration: vi.fn((duration: number) => `${duration}ms`),
  };
});

describe("CompletedTaskComponent", () => {
  const mockTask: CompletedTask = {
    taskName: "Test Task",
    pid: '1234',
    duration: 1500,
  };

  it("renders task name, pid, and formatted duration", () => {
    render(<CompletedTaskComponent task={mockTask} />);
    expect(screen.getByText(/Task: Test Task/)).toBeInTheDocument();
    expect(screen.getByText(/PID: 1234/)).toBeInTheDocument();
    expect(screen.getByText(/1500ms/)).toBeInTheDocument();
  });

  it("applies warning class when duration is greater than 1000", () => {
    render(<CompletedTaskComponent task={mockTask} />);
    const card = screen.getByText(/Task: Test Task/).closest(".task-card");
    expect(card).toHaveClass("warning");
  });
});