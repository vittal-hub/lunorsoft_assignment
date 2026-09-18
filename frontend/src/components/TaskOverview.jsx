import { formatDeadline, isTaskOverdue } from "../utils/deadline";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
    : "-";

const TaskOverview = ({ task, onClose, onEdit, onDelete, onToggleComplete }) => {
  if (!task) return null;

  const isOverdue = isTaskOverdue(task);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task.title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-row">
            <span className="modal-label">Status</span>
            <span className={`badge ${task.completed ? "badge-completed" : "badge-pending"}`}>
              {task.completed ? "Completed" : "Pending"}
            </span>
            {isOverdue && <span className="overdue-tag">Overdue</span>}
          </div>

          <div className="modal-row">
            <span className="modal-label">Subject</span>
            <span className="subject-tag">{task.subject || "Other"}</span>
          </div>

          <div className="modal-row">
            <span className="modal-label">Priority</span>
            <span className={`priority-tag priority-${task.priority.toLowerCase()}`}>
              {task.priority}
            </span>
          </div>

          <div className="modal-row">
            <span className="modal-label">Due date</span>
            <span>{formatDeadline(task.dueDate)}</span>
          </div>

          {task.description && (
            <div className="modal-row modal-row-block">
              <span className="modal-label">Description</span>
              <p>{task.description}</p>
            </div>
          )}

          <div className="modal-row">
            <span className="modal-label">Created</span>
            <span>{formatDate(task.createdAt)}</span>
          </div>

          {task.completedAt && (
            <div className="modal-row">
              <span className="modal-label">Completed</span>
              <span>{formatDate(task.completedAt)}</span>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button onClick={() => onToggleComplete(task)}>
            {task.completed ? "Mark Pending" : "Mark Complete"}
          </button>
          <button className="btn-secondary" onClick={() => onEdit(task)}>
            Edit
          </button>
          <button className="btn-danger" onClick={() => onDelete(task._id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskOverview;
