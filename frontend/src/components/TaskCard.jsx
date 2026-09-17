const TaskCard = ({ task, onEdit, onDelete, onToggleComplete, onView, readOnly }) => {
  const isOverdue = !task.completed && new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0);

  // Action buttons sit inside the clickable card, so stop the click from also opening the overview
  const stopAndRun = (handler) => (e) => {
    e.stopPropagation();
    handler();
  };

  return (
    <div
      className={`task-card priority-${task.priority.toLowerCase()} ${onView ? "task-card-clickable" : ""}`}
      onClick={onView ? () => onView(task) : undefined}
    >
      <div className="task-card-header">
        <h3>{task.title}</h3>
        <span className={`badge ${task.completed ? "badge-completed" : "badge-pending"}`}>
          {task.completed ? "Completed" : "Pending"}
        </span>
      </div>

      {task.subject && <span className="subject-tag">{task.subject}</span>}

      {task.description && <p className="task-description">{task.description}</p>}

      <div className="task-meta">
        <span className={`priority-tag priority-${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
        {isOverdue && <span className="overdue-tag">Overdue</span>}
      </div>

      {!readOnly && (
        <div className="task-actions">
          <button onClick={stopAndRun(() => onToggleComplete(task))}>
            {task.completed ? "Mark Pending" : "Mark Complete"}
          </button>
          <button onClick={stopAndRun(() => onEdit(task))}>Edit</button>
          <button className="btn-danger" onClick={stopAndRun(() => onDelete(task._id))}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
