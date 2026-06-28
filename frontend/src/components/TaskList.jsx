import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, loading, onEdit, onDelete, onCycleStatus }) => {
  if (loading) {
    return (
      <div className="state-block">
        <div className="spinner" aria-hidden="true" />
        <p>Pulling the log…</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="state-block state-block--empty">
        <p className="state-block__headline">Nothing logged here.</p>
        <p>Add a task above, or clear your filters to see the full log.</p>
      </div>
    );
  }

  return (
    <ul className="ticket-list">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onCycleStatus={onCycleStatus}
        />
      ))}
    </ul>
  );
};

export default TaskList;
