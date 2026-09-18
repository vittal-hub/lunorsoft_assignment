import { formatDeadline, isTaskOverdue } from "../utils/deadline";

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="icon-calendar">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
  </svg>
);

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete, onView, readOnly }) => {
  const isOverdue = isTaskOverdue(task);

  // Action buttons sit inside the clickable card, so stop the click from also opening the overview
  const stopAndRun = (handler) => (e) => {
    e.stopPropagation();
    handler();
  };

  return (
    <div
      className={`task-card ${onView ? "task-card-clickable" : ""}`}
      onClick={onView ? () => onView(task) : undefined}
    >
      <div className="task-card-header">
        <h3>{task.title}</h3>
        <span className={`badge ${task.completed ? "badge-completed" : "badge-pending"}`}>
          {task.completed ? "Completed" : "Pending"}
        </span>
      </div>

      <div className="task-tags">
        {task.subject && <span className="subject-tag">{task.subject}</span>}
        <span className={`priority-tag priority-${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
      </div>

      {task.description && <p className="task-description">{task.description}</p>}

      <div className="task-card-footer">
        <div className="task-meta">
          <span className="task-due-date">
            <CalendarIcon />
            Due: {formatDeadline(task.dueDate)}
          </span>
          {isOverdue && <span className="overdue-tag">Overdue</span>}
        </div>

        {!readOnly && (
          <div className="task-actions">
            <button onClick={stopAndRun(() => onToggleComplete(task))}>
              {task.completed ? "Mark Pending" : "Mark Complete"}
            </button>
            <button className="btn-secondary" onClick={stopAndRun(() => onEdit(task))}>
              Edit
            </button>
            <button className="btn-danger" onClick={stopAndRun(() => onDelete(task._id))}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
