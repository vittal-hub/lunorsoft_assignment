import { useEffect, useState } from "react";
import { SUBJECTS } from "../constants";
import { combineDeadline, splitDeadlineForForm } from "../utils/deadline";

const emptyForm = { title: "", description: "", subject: "Other", priority: "Medium", dueDate: "" };

const TaskForm = ({ onSubmit, editingTask, onCancel, saving }) => {
  const [form, setForm] = useState(emptyForm);
  const [customSubject, setCustomSubject] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("");
  const [error, setError] = useState("");

  // Load existing task data into the form when editing
  useEffect(() => {
    if (editingTask) {
      const isCustomSubject = editingTask.subject && !SUBJECTS.includes(editingTask.subject);
      const { date, time } = splitDeadlineForForm(editingTask.dueDate);
      setForm({
        title: editingTask.title,
        description: editingTask.description || "",
        subject: isCustomSubject ? "Other" : editingTask.subject || "Other",
        priority: editingTask.priority,
        dueDate: date,
      });
      setCustomSubject(isCustomSubject ? editingTask.subject : "");
      setDeadlineTime(time);
    } else {
      setForm(emptyForm);
      setCustomSubject("");
      setDeadlineTime("");
    }
  }, [editingTask]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Hide and clear the custom subject field whenever a predefined subject is chosen again
  const handleSubjectChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, subject: value });
    if (value !== "Other") {
      setCustomSubject("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!form.subject) {
      setError("Subject is required");
      return;
    }
    if (form.subject === "Other" && !customSubject.trim()) {
      setError("Please enter a custom subject");
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

    const subject = form.subject === "Other" ? customSubject.trim() : form.subject;
    const dueDate = combineDeadline(form.dueDate, deadlineTime);
    onSubmit({ ...form, subject, dueDate });
    setForm(emptyForm);
    setCustomSubject("");
    setDeadlineTime("");
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2 className="task-form-heading">{editingTask ? "Update Task" : "Create Task"}</h2>

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
          <select name="subject" value={form.subject} onChange={handleSubjectChange}>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {form.subject === "Other" && (
            <>
              <label>Other Subject</label>
              <input
                name="customSubject"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="Enter subject name"
              />
            </>
          )}
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

      <div className="task-form-row">
        <div className="task-form-field">
          <label>Due Date</label>
          <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
        </div>

        <div className="task-form-field">
          <label>Deadline Time (optional)</label>
          <input
            type="time"
            name="deadlineTime"
            value={deadlineTime}
            onChange={(e) => setDeadlineTime(e.target.value)}
          />
        </div>
      </div>

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
