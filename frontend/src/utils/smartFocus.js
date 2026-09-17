// Simple rule-based "what should I do next" recommendation - no ML, just weighted scoring

const DAY_MS = 24 * 60 * 60 * 1000;

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const dueDateBucket = (dueDate) => {
  if (!dueDate) return "none";
  const diffDays = Math.round((startOfDay(dueDate) - startOfDay(new Date())) / DAY_MS);

  if (diffDays < 0) return "overdue";
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "tomorrow";
  if (diffDays <= 7) return "week";
  return "later";
};

const DUE_SCORE = { overdue: 10, today: 8, tomorrow: 6, week: 4, later: 2, none: 1 };
const PRIORITY_SCORE = { High: 3, Medium: 2, Low: 1 };

const daysPending = (task) => {
  const created = task.createdAt ? new Date(task.createdAt) : new Date();
  return Math.max(0, Math.floor((Date.now() - created.getTime()) / DAY_MS));
};

// Small, capped bonus so long-pending tasks float up without overriding due-date urgency
const ageBonus = (task) => Math.min(daysPending(task) * 0.3, 3);

const scoreTask = (task) => {
  const bucket = dueDateBucket(task.dueDate);
  const score = DUE_SCORE[bucket] + (PRIORITY_SCORE[task.priority] || 0) + ageBonus(task);
  return { bucket, score };
};

const DUE_TEXT = {
  overdue: "overdue",
  today: "due today",
  tomorrow: "due tomorrow",
  week: "due soon",
  later: "due later",
  none: "has no due date",
};

const PRIORITY_TEXT = { High: "a high priority", Medium: "a medium priority", Low: "a low priority" };

const buildReason = (task, bucket) => {
  const priorityText = PRIORITY_TEXT[task.priority] || "a priority";
  if (bucket === "overdue") {
    return `Recommended because it's overdue and has ${priorityText}.`;
  }
  if (daysPending(task) >= 7) {
    return `Recommended because it has been pending for a while and has ${priorityText}.`;
  }
  return `Recommended because it has ${priorityText} and is ${DUE_TEXT[bucket]}.`;
};

// Human-friendly due date label used by the Smart Focus card
export const formatDueLabel = (dueDate) => {
  if (!dueDate) return "No due date";
  const bucket = dueDateBucket(dueDate);
  if (bucket === "today") return "Today";
  if (bucket === "tomorrow") return "Tomorrow";
  const label = new Date(dueDate).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return bucket === "overdue" ? `${label} (overdue)` : label;
};

// Picks the single pending task most worth focusing on next, or null if none are pending
export const getSmartFocusTask = (tasks) => {
  const pending = tasks.filter((t) => !t.completed);
  if (pending.length === 0) return null;

  let best = null;
  let bestScore = -Infinity;
  let bestBucket = null;

  for (const task of pending) {
    const { bucket, score } = scoreTask(task);
    const isBetter =
      score > bestScore || (score === bestScore && new Date(task.dueDate) < new Date(best.dueDate));
    if (isBetter) {
      best = task;
      bestScore = score;
      bestBucket = bucket;
    }
  }

  return { task: best, reason: buildReason(best, bestBucket) };
};
