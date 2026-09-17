import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { createTask, deleteTask, updateTask } from "../services/taskService";
import { getErrorMessage } from "../services/api";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import FilterBar from "../components/FilterBar";

const Tasks = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");

  const { tasks, loading, error: loadError, refetch } = useTasks({ search, status, priority });

  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAddOrUpdate = async (formData) => {
    setFormError("");
    setSaving(true);
    try {
      if (editingTask) {
        await updateTask(editingTask._id, formData);
      } else {
        await createTask(formData);
      }
      setEditingTask(null);
      setShowForm(false);
      refetch();
    } catch (err) {
      setFormError(getErrorMessage(err, "Task could not be saved"));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
    setFormError("");
  };

  const handleCancel = () => {
    setEditingTask(null);
    setShowForm(false);
    setFormError("");
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      refetch();
    } catch (err) {
      setFormError(getErrorMessage(err, "Task could not be deleted"));
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await updateTask(task._id, { completed: !task.completed });
      refetch();
    } catch (err) {
      setFormError(getErrorMessage(err, "Task could not be updated"));
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">My Tasks</h1>

      {loadError && <p className="error-message">{loadError}</p>}
      {formError && <p className="error-message">{formError}</p>}

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
          <TaskForm
            onSubmit={handleAddOrUpdate}
            editingTask={editingTask}
            onCancel={handleCancel}
            saving={saving}
          />
        )}

        {loading ? (
          <p className="loading-text">Loading tasks...</p>
        ) : (
          <TaskList
            tasks={tasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleComplete={handleToggleComplete}
            hasFilters={Boolean(search) || status !== "All" || priority !== "All"}
          />
        )}
      </section>
    </div>
  );
};

export default Tasks;
