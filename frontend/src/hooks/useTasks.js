import { useCallback, useEffect, useState } from "react";
import { getTasks } from "../services/taskService";
import { getErrorMessage } from "../services/api";

// Fetch the logged-in user's tasks, optionally filtered by status/priority/subject/search
export const useTasks = (filters = {}) => {
  const { search = "", status = "All", priority = "All", subject = "All" } = filters;
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = useCallback(async () => {
    setError("");
    try {
      const params = {};
      if (search) params.search = search;
      if (status !== "All") params.status = status;
      if (priority !== "All") params.priority = priority;
      if (subject !== "All") params.subject = subject;

      const res = await getTasks(params);
      setTasks(res.data.tasks);
    } catch (err) {
      setError(getErrorMessage(err, "Could not load tasks. Please try again."));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, priority, subject]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(fetchTasks, 300);
    return () => clearTimeout(timer);
  }, [fetchTasks]);

  return { tasks, loading, error, refetch: fetchTasks };
};
