// Simple date-based helpers for the dashboard - no external date library needed

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const isDueToday = (dueDate) => isSameDay(new Date(dueDate), new Date());

// Counts consecutive days (ending today or yesterday) with at least one completed task
export const calculateStreak = (tasks) => {
  const completedDays = new Set(
    tasks.filter((t) => t.completed && t.completedAt).map((t) => new Date(t.completedAt).toDateString())
  );

  if (completedDays.size === 0) return 0;

  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  // If nothing was completed today yet, check the streak up to yesterday instead of zeroing it out
  if (!completedDays.has(cursor.toDateString())) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (completedDays.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};
