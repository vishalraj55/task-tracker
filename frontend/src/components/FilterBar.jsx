import React from 'react';

const FilterBar = ({ filters, onChange, taskCount }) => {
  const handle = (field) => (e) => onChange({ ...filters, [field]: e.target.value });

  return (
    <div className="filter-bar">
      <div className="filter-bar__group" role="group" aria-label="Filter by status">
        {['all', 'pending', 'in-progress', 'completed'].map((value) => (
          <button
            key={value}
            type="button"
            className={`chip ${filters.status === value ? 'chip--active' : ''}`}
            onClick={() => onChange({ ...filters, status: value })}
          >
            {value === 'all' ? 'All' : value.replace('-', ' ')}
          </button>
        ))}
      </div>

      <div className="filter-bar__group filter-bar__group--right">
        <select
          value={filters.priority}
          onChange={handle('priority')}
          aria-label="Filter by priority"
        >
          <option value="all">Any priority</option>
          <option value="high">High priority</option>
          <option value="medium">Medium priority</option>
          <option value="low">Low priority</option>
        </select>

        <select value={filters.sortBy} onChange={handle('sortBy')} aria-label="Sort by">
          <option value="createdAt">Newest first</option>
          <option value="dueDate">By due date</option>
          <option value="priority">By priority</option>
          <option value="title">By title</option>
        </select>

        <span className="filter-bar__count">{taskCount} shown</span>
      </div>
    </div>
  );
};

export default FilterBar;
