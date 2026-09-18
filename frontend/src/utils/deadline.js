// Shared helpers for the task "dueDate" field, which stores a plain date
// (legacy behavior, parsed as UTC midnight) or a full date+time instant when
// the user also picks a deadline time. There is no separate boolean flag -
// a dueDate is treated as "date only" when its UTC time is exactly midnight,
// which is always true for plain "YYYY-MM-DD" values regardless of timezone.

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const hasDeadlineTime = (dueDate) => {
  if (!dueDate) return false;
  const d = new Date(dueDate);
  return !(
    d.getUTCHours() === 0 &&
    d.getUTCMinutes() === 0 &&
    d.getUTCSeconds() === 0 &&
    d.getUTCMilliseconds() === 0
  );
};

export const formatTime12h = (date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${String(minutes).padStart(2, "0")} ${ampm}`;
};

// "18 Sep 2026" or, when a time was set, "18 Sep 2026, 6:30 PM"
export const formatDeadline = (dueDate) => {
  if (!dueDate) return "-";
  const d = new Date(dueDate);
  const withTime = hasDeadlineTime(dueDate);

  // Date-only deadlines read their calendar date from the UTC components so the
  // displayed day matches what was picked, regardless of the viewer's timezone.
  const day = withTime ? d.getDate() : d.getUTCDate();
  const month = withTime ? d.getMonth() : d.getUTCMonth();
  const year = withTime ? d.getFullYear() : d.getUTCFullYear();
  const datePart = `${day} ${MONTHS[month]} ${year}`;

  return withTime ? `${datePart}, ${formatTime12h(d)}` : datePart;
};

// A task is overdue once its exact deadline instant has passed (when a time is
// set) or once its entire due date has fully elapsed (date-only, legacy behavior).
export const isTaskOverdue = (task) => {
  if (task.completed || !task.dueDate) return false;
  if (hasDeadlineTime(task.dueDate)) {
    return new Date(task.dueDate) < new Date();
  }
  return new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0);
};

// Combines a "YYYY-MM-DD" date input value with an optional "HH:MM" time input
// value into what gets sent to the API. With no time, the plain date string is
// left untouched to preserve existing date-only behavior exactly.
export const combineDeadline = (dateStr, timeStr) => {
  if (!dateStr) return "";
  if (!timeStr) return dateStr;
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm, 0, 0).toISOString();
};

// Splits a stored dueDate back into separate date/time form-field values for editing.
export const splitDeadlineForForm = (dueDate) => {
  if (!dueDate) return { date: "", time: "" };
  if (!hasDeadlineTime(dueDate)) {
    return { date: dueDate.slice(0, 10), time: "" };
  }
  const d = new Date(dueDate);
  const pad = (n) => String(n).padStart(2, "0");
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
};
