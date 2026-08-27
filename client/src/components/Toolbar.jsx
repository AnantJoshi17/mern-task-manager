// components/Toolbar.jsx
// Search box + the three filter buttons.
// This component stores nothing itself — it only reports changes upward.
// That pattern is called a "controlled" or "dumb" component.

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Done' },
];

function Toolbar({ search, onSearchChange, filter, onFilterChange, counts }) {
  return (
    <div className="toolbar">
      <input
        type="search"
        className="search-input"
        placeholder="Search tasks by title"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        aria-label="Search tasks by title"
      />

      <div className="filters" role="group" aria-label="Filter tasks">
        {FILTERS.map((option) => (
          <button
            key={option.value}
            type="button"
            // Template literal adds the 'is-active' class only to the selected one.
            className={`filter-btn ${filter === option.value ? 'is-active' : ''}`}
            onClick={() => onFilterChange(option.value)}
            aria-pressed={filter === option.value}
          >
            {option.label}
            <span className="filter-count">{counts[option.value]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Toolbar;
