import { addWarningErrorClass, formatDuration } from "../../utils/utils";
import type { CompletedTask } from "../../utils/types";
import "./CompletedTaskComponent.scss";

interface CompletedTaskProps {
  task: CompletedTask;
}

const CompletedTaskComponent = ({ task }: CompletedTaskProps) => {
  return (
    <div className={`task-card ${addWarningErrorClass(task.duration)}`}>
      <p className={`task-name`}>Task: {task.taskName}</p>
      <p className={`task-pid ${addWarningErrorClass(task.duration)}`}>
        PID: {task.pid}
      </p>
      <p className="task-duration">
        Duration:{" "}
        <span className="duration-value">{formatDuration(task.duration)}</span>
      </p>
    </div>
  );
};
export default CompletedTaskComponent;
