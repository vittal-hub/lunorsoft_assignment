import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../hooks/useTasks";
import { updateTask, deleteTask } from "../services/taskService";
import { getGreeting, isDueToday, calculateStreak } from "../utils/dashboard";
import { getSmartFocusTask, formatDueLabel } from "../utils/smartFocus";
import { hasDeadlineTime, formatTime12h } from "../utils/deadline";
import TaskOverview from "./TaskOverview";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { tasks, loading, error, refetch } = useTasks();
  const [viewingTask, setViewingTask] = useState(null);

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  const todayTasks = tasks.filter((t) => isDueToday(t.dueDate));
  const todayPending = todayTasks.filter((t) => !t.completed).length;
  const todayCompleted = todayTasks.filter((t) => t.completed).length;

  const streak = calculateStreak(tasks);
  const smartFocus = getSmartFocusTask(tasks);

  const handleToggleComplete = async (task) => {
    try {
      await updateTask(task._id, { completed: !task.completed });
      setViewingTask(null);
      refetch();
    } catch (err) {
      // Dashboard toggle is a quick action; full error handling lives on the Tasks page
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setViewingTask(null);
      refetch();
    } catch (err) {
      // Dashboard delete is a quick action; full error handling lives on the Tasks page
    }
  };

  const handleEdit = () => {
    setViewingTask(null);
    navigate("/tasks");
  };

  return (
    <div className="page-container">
      <div className="dashboard-welcome">
        <div>
          <h1 className="page-title">
            {getGreeting()}, {user?.name}
          </h1>
          <p className="page-subtitle">Here's what you need to focus on today.</p>
        </div>
        <Link to="/tasks" className="btn-link btn-primary-link">
          + Add Task
        </Link>
      </div>

      {error && <p className="error-message">{error}</p>}

      <section className="stats">
        <div className="stat-card">
          <h3>{totalTasks}</h3>
          <p>Total Tasks</p>
        </div>
        <div className="stat-card">
          <h3>{pendingTasks}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card">
          <h3>{completedTasks}</h3>
          <p>Completed</p>
        </div>
        <div className="stat-card">
          <h3>{todayTasks.length}</h3>
          <p>Today's Tasks</p>
        </div>
      </section>

      <section className="streak-card">
        <span className="streak-icon">🔥</span>
        <div>
          {streak > 0 ? (
            <>
              <p className="streak-count">{streak} Day Streak</p>
              <p className="streak-caption">
                You completed at least one task for {streak} day{streak === 1 ? "" : "s"} in a row.
              </p>
            </>
          ) : (
            <p className="streak-count">Start your streak today.</p>
          )}
        </div>
      </section>

      <section className="smart-focus-card">
        <div className="smart-focus-header">
          <span className="smart-focus-icon" aria-hidden="true">
            🎯
          </span>
          <div>
            <h2 className="section-title">Smart Focus</h2>
            <p className="smart-focus-subtitle">What should I work on next?</p>
          </div>
        </div>

        {smartFocus ? (
          <div className="smart-focus-body">
            <div className="smart-focus-info">
              <h3 className="smart-focus-title">{smartFocus.task.title}</h3>
              <div className="task-tags">
                {smartFocus.task.subject && (
                  <span className="subject-tag">{smartFocus.task.subject}</span>
                )}
                <span className={`priority-tag priority-${smartFocus.task.priority.toLowerCase()}`}>
                  {smartFocus.task.priority}
                </span>
              </div>
              <p className="smart-focus-due">📅 Due: {formatDueLabel(smartFocus.task.dueDate)}</p>
              <p className="smart-focus-status">Status: Pending</p>
              <p className="smart-focus-reason">{smartFocus.reason}</p>
            </div>
            <button className="smart-focus-start" onClick={() => setViewingTask(smartFocus.task)}>
              Start Task →
            </button>
          </div>
        ) : (
          <p className="smart-focus-empty">🎉 You're all caught up!</p>
        )}
      </section>

      <section className="task-management">
        <div className="task-management-header">
          <h2 className="section-title">Today's Tasks</h2>
          <Link to="/tasks" className="btn-link">
            View All Tasks
          </Link>
        </div>

        {loading ? (
          <p className="loading-text">Loading dashboard...</p>
        ) : todayTasks.length === 0 ? (
          <p className="empty-state">You're all caught up for today.</p>
        ) : (
          <>
            <ul className="today-list">
              {todayTasks.map((task) => (
                <li key={task._id} className="today-item">
                  <button
                    className={`today-checkbox ${task.completed ? "today-checkbox-checked" : ""}`}
                    onClick={() => handleToggleComplete(task)}
                    aria-label={task.completed ? "Mark as pending" : "Mark as complete"}
                  >
                    {task.completed ? "✓" : ""}
                  </button>
                  <span className={task.completed ? "today-text-done" : ""}>{task.title}</span>
                  {hasDeadlineTime(task.dueDate) && (
                    <span className="today-item-time">{formatTime12h(new Date(task.dueDate))}</span>
                  )}
                </li>
              ))}
            </ul>
            <p className="today-summary">
              {todayTasks.length} Tasks · {todayPending} Pending · {todayCompleted} Completed
            </p>
          </>
        )}
      </section>

      <TaskOverview
        task={viewingTask}
        onClose={() => setViewingTask(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleComplete={handleToggleComplete}
      />
    </div>
  );
};

export default Dashboard;
