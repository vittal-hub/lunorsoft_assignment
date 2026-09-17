import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { createTask, deleteTask, updateTask } from "../services/taskService";
import { getErrorMessage } from "../services/api";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import FilterBar from "../components/FilterBar";
import TaskOverview from "../components/TaskOverview";

const Tasks = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [subject, setSubject] = useState("All");

  const { tasks, loading, error: loadError, refetch } = useTasks({
    search,
    status,
    priority,
    subject,
  });

  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleAddOrUpdate = async (formData) => {
    setFormError("");
    setSaving(true);
    try {
      if (editingTask) {
        await updateTask(editingTask._id, formData);
        showSuccess("Task updated successfully.");
      } else {
        await createTask(formData);
        showSuccess("Task created successfully.");
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
    setViewingTask(null);
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
      setViewingTask(null);
      showSuccess("Task deleted successfully.");
      refetch();
    } catch (err) {
      setFormError(getErrorMessage(err, "Task could not be deleted"));
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await updateTask(task._id, { completed: !task.completed });
      setViewingTask(null);
      showSuccess(task.completed ? "Task marked as pending." : "Task marked as completed.");
      refetch();
    } catch (err) {
      setFormError(getErrorMessage(err, "Task could not be updated"));
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">My Tasks</h1>
      <p className="page-subtitle">Manage your academic and personal tasks.</p>

      {loadError && <p className="error-message">{loadError}</p>}
      {formError && <p className="error-message">{formError}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <section className="task-management">
        <div className="task-management-header">
          <FilterBar
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            priority={priority}
            setPriority={setPriority}
            subject={subject}
            setSubject={setSubject}
          />
          {!showForm && <button onClick={() => setShowForm(true)}>+ Add Task</button>}
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
            onView={setViewingTask}
            hasFilters={
              Boolean(search) || status !== "All" || priority !== "All" || subject !== "All"
            }
          />
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

export default Tasks;
