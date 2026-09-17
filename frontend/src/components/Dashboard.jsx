import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../hooks/useTasks";
import TaskList from "./TaskList";

const RECENT_TASKS_COUNT = 5;

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, loading, error } = useTasks();

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const recentTasks = tasks.slice(0, RECENT_TASKS_COUNT);

  return (
    <div className="page-container">
      <div className="dashboard-welcome">
        <h1 className="page-title">Welcome back, {user?.name}</h1>
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
      </section>

      <section className="task-management">
        <div className="task-management-header">
          <h2 className="section-title">Recent Tasks</h2>
          <Link to="/tasks" className="btn-link">
            View All Tasks
          </Link>
        </div>

        {loading ? (
          <p className="loading-text">Loading dashboard...</p>
        ) : (
          <TaskList tasks={recentTasks} readOnly />
        )}
      </section>
    </div>
  );
};

export default Dashboard;
