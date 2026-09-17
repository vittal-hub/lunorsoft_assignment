import { SUBJECTS } from "../constants";

const FilterBar = ({
  search,
  setSearch,
  status,
  setStatus,
  priority,
  setPriority,
  subject,
  setSubject,
}) => {
  return (
    <div className="filter-bar">
      <input
        type="text"
        placeholder="Search by title or description..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="All">All Status</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>

      <select value={subject} onChange={(e) => setSubject(e.target.value)}>
        <option value="All">All Subjects</option>
        {SUBJECTS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="All">All Priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
    </div>
  );
};

export default FilterBar;
