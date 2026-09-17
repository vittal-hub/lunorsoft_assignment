const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const isOverdue = !task.completed && new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0);

  return (
    <div className={`task-card priority-${task.priority.toLowerCase()}`}>
      <div className="task-card-header">
        <h3>{task.title}</h3>
        <span className={`badge ${task.completed ? "badge-completed" : "badge-pending"}`}>
          {task.completed ? "Completed" : "Pending"}
        </span>
      </div>

      {task.description && <p className="task-description">{task.description}</p>}

      <div className="task-meta">
        <span className={`priority-tag priority-${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
        {isOverdue && <span className="overdue-tag">Overdue</span>}
      </div>

      <div className="task-actions">
        <button onClick={() => onToggleComplete(task)}>
          {task.completed ? "Mark Pending" : "Mark Complete"}
        </button>
        <button onClick={() => onEdit(task)}>Edit</button>
        <button className="btn-danger" onClick={() => onDelete(task._id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
