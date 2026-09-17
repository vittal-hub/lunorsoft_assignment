import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../hooks/useTasks";
import { updateTask } from "../services/taskService";
import { getGreeting, isDueToday, calculateStreak } from "../utils/dashboard";

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, loading, error, refetch } = useTasks();

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  const todayTasks = tasks.filter((t) => isDueToday(t.dueDate));
  const todayPending = todayTasks.filter((t) => !t.completed).length;
  const todayCompleted = todayTasks.filter((t) => t.completed).length;

  const streak = calculateStreak(tasks);

  const handleToggleComplete = async (task) => {
    try {
      await updateTask(task._id, { completed: !task.completed });
      refetch();
    } catch (err) {
      // Dashboard toggle is a quick action; full error handling lives on the Tasks page
    }
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
                </li>
              ))}
            </ul>
            <p className="today-summary">
              {todayTasks.length} Tasks · {todayPending} Pending · {todayCompleted} Completed
            </p>
          </>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
