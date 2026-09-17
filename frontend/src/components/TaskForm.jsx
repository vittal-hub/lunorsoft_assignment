import { useEffect, useState } from "react";

const emptyForm = { title: "", description: "", priority: "Medium", dueDate: "" };

const TaskForm = ({ onSubmit, editingTask, onCancel }) => {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  // Load existing task data into the form when editing
  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description || "",
        priority: editingTask.priority,
        dueDate: editingTask.dueDate ? editingTask.dueDate.slice(0, 10) : "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingTask]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!form.priority) {
      setError("Priority is required");
      return;
    }
    if (!form.dueDate) {
      setError("Due date is required");
      return;
    }

    onSubmit(form);
    setForm(emptyForm);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      {error && <p className="error-message">{error}</p>}

      <label>Title</label>
      <input name="title" value={form.title} onChange={handleChange} placeholder="Task title" />

      <label>Description</label>
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Optional description"
      />

      <label>Priority</label>
      <select name="priority" value={form.priority} onChange={handleChange}>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <label>Due Date</label>
      <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />

      <div className="task-form-buttons">
        <button type="submit">{editingTask ? "Update Task" : "Add Task"}</button>
        {editingTask && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
