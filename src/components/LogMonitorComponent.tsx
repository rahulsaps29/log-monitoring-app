import { useEffect, useState } from "react";
import { parseLogs } from "../utils/logParser";
import type { CompletedTask, UnmatchedEvent } from "../utils/types";
import "./LogMonitorComponent.scss";
import { addWarningErrorClass, formatDuration } from "../utils/utils";

const LogMonitorComponent = () => {
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [unmatchedStartEvents, setUnmatchedStartEvents] = useState<UnmatchedEvent[]>([]);
  const [unmatchedEndEvents, setUnmatchedEndEvents] = useState<UnmatchedEvent[]>([]);

  useEffect(() => {
    const readLogFile = async () => {
      const response = await fetch("/logs.log");
      const resText = await response.text();
      const { completedTasks, unmatchedStartEvents, unmatchedEndEvents } = parseLogs(resText);
      setCompletedTasks(completedTasks);
      setUnmatchedStartEvents(unmatchedStartEvents);
      setUnmatchedEndEvents(unmatchedEndEvents);
    };

    readLogFile();
  }, []);

  return (
    <div className="log-parser-container">
      <div className="log-parser-card">
        <h1 className="dashboard-title">Log Parser Dashboard</h1>
        <div className="content-sections">
          {/* Completed Tasks Section */}
          <div className="completed-tasks-section">
            <h2 className="section-title">Completed Tasks</h2>
            {completedTasks.length > 0 ? (
              <div className="tasks-grid">
                {completedTasks.map((task, index) => (
                  <div
                    key={index}
                    className={`task-card ${addWarningErrorClass(
                      task.duration
                    )}`}
                  >
                    <p className={`task-name`}>Task: {task.taskName}</p>
                    <p
                      className={`task-pid ${addWarningErrorClass(
                        task.duration
                      )}`}
                    >
                      PID: {task.pid}
                    </p>
                    <p className="task-duration">
                      Duration:{" "}
                      <span className="duration-value">
                        {formatDuration(task.duration)}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data-message">No completed tasks found.</p>
            )}
          </div>

          {/* Unmatched Events Section */}
          <div>
            <h2 className="section-title">Unmatched Events</h2>
            {unmatchedStartEvents.length > 0 ||
            unmatchedEndEvents.length > 0 ? (
              <div className="unmatched-section">
                {/* Unmatched Start Events */}
                <div>
                  <h3 className="unmatched-title">
                    Unmatched Start Events (Still running)
                  </h3>
                  <ul className="unmatched-list">
                    {unmatchedStartEvents.map((event, index) => (
                      <li key={`start-${index}`} className="unmatched-item">
                        Task:{" "}
                        <span className="font-semibold">{event.taskName}</span>{" "}
                        (PID: {event.pid}) started at{" "}
                        {event.timestamp.toLocaleTimeString()}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Unmatched End Events */}
                <div>
                  <h3 className="unmatched-title">
                    Unmatched End Events (Missing start)
                  </h3>
                  <ul className="unmatched-list">
                    {unmatchedEndEvents.map((event, index) => (
                      <li key={`end-${index}`} className="unmatched-item">
                        Task:{" "}
                        <span className="font-semibold">{event.taskName}</span>{" "}
                        (PID: {event.pid}) ended at{" "}
                        {event.timestamp.toLocaleTimeString()}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="no-data-message">No unmatched events found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default LogMonitorComponent;
