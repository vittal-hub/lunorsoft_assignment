import TaskCard from "./TaskCard";

const TaskList = ({ tasks, onEdit, onDelete, onToggleComplete, hasFilters, readOnly }) => {
  if (tasks.length === 0) {
    return (
      <p className="empty-state">
        {hasFilters ? "No tasks found." : "No tasks yet. Create your first task to get started."}
      </p>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
};

export default TaskList;
