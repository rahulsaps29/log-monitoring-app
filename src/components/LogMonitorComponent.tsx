import { useEffect, useState } from "react";
import { parseLogs } from "../utils/logParser";
import type { CompletedTask, UnmatchedEvent } from "../utils/types";
import "./LogMonitorComponent.scss";
import CompletedTaskComponent from "./CompletedTaskComponent/CompletedTaskComponent";

const LogMonitorComponent = () => {
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [unmatchedEvents, setUnmatchedEvents] = useState<UnmatchedEvent[]>([]);

  useEffect(() => {
    const readLogFile = async () => {
      const response = await fetch("/logs.log");
      const resText = await response.text();
      const { completedTasks, unmatchedEvents } = parseLogs(resText);
      setCompletedTasks(completedTasks);
      setUnmatchedEvents(unmatchedEvents);
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
                  <CompletedTaskComponent key={index} task={task} />
                ))}
              </div>
            ) : (
              <p className="no-data-message">No completed tasks found.</p>
            )}
          </div>

          {/* Unmatched Events Section */}
          <div>
            <h2 className="section-title">Unmatched Events</h2>
            {unmatchedEvents.length > 0 ? (
              <div className="unmatched-section">
                {/* Unmatched Start Events */}
                <div>
                  <h3 className="unmatched-title">Unmatched Start Events (Still running)</h3>
                  <ul className="unmatched-list">
                    {unmatchedEvents.map((event, index) => (
                      <li key={`start-${index}`} className="unmatched-item">
                        Task:{" "}
                        <span className="font-semibold">{event.taskName}</span>{" "}
                        (PID: {event.pid}) started at{" "}
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
