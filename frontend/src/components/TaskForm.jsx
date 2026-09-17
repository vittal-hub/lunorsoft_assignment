import { useEffect, useState } from "react";
import { SUBJECTS } from "../constants";

const emptyForm = { title: "", description: "", subject: "Other", priority: "Medium", dueDate: "" };

const TaskForm = ({ onSubmit, editingTask, onCancel, saving }) => {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  // Load existing task data into the form when editing
  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description || "",
        subject: editingTask.subject || "Other",
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

      <div className="task-form-row">
        <div className="task-form-field">
          <label>Subject</label>
          <select name="subject" value={form.subject} onChange={handleChange}>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="task-form-field">
          <label>Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      <label>Due Date</label>
      <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />

      <div className="task-form-buttons">
        <button type="submit" disabled={saving}>
          {saving
            ? editingTask
              ? "Updating task..."
              : "Creating task..."
            : editingTask
            ? "Update Task"
            : "Add Task"}
        </button>
        {editingTask && (
          <button type="button" className="btn-secondary" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
