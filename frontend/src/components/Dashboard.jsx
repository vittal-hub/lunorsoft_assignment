import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createTask, deleteTask, getTasks, updateTask } from "../services/taskService";
import { getErrorMessage } from "../services/api";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import FilterBar from "./FilterBar";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");

  const fetchTasks = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (status !== "All") params.status = status;
      if (priority !== "All") params.priority = priority;

      const res = await getTasks(params);
      setTasks(res.data.tasks);

      // Unfiltered list, used only for dashboard statistics
      const allRes = await getTasks({});
      setAllTasks(allRes.data.tasks);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  // Refetch tasks whenever search or filters change
  useEffect(() => {
    const timer = setTimeout(fetchTasks, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, priority]);

  const handleAddOrUpdate = async (formData) => {
    setError("");
    try {
      if (editingTask) {
        await updateTask(editingTask._id, formData);
      } else {
        await createTask(formData);
      }
      setEditingTask(null);
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      setError(getErrorMessage(err, "Task could not be saved"));
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingTask(null);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      setError("Task could not be deleted");
    }
  };

  const handleToggleComplete = async (task) => {
    setError("");
    try {
      await updateTask(task._id, { completed: !task.completed });
      fetchTasks();
    } catch (err) {
      setError("Task could not be updated");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const totalTasks = allTasks.length;
  const pendingTasks = allTasks.filter((t) => !t.completed).length;
  const completedTasks = allTasks.filter((t) => t.completed).length;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Student Task Manager</h1>
        <div className="header-right">
          <span>Hi, {user?.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

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
          <FilterBar
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            priority={priority}
            setPriority={setPriority}
          />
          {!showForm && <button onClick={() => setShowForm(true)}>Add Task</button>}
        </div>

        {showForm && (
          <TaskForm onSubmit={handleAddOrUpdate} editingTask={editingTask} onCancel={handleCancel} />
        )}

        <TaskList
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleComplete={handleToggleComplete}
        />
      </section>
    </div>
  );
};

export default Dashboard;
