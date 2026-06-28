import React, { useState } from 'react';
import ConfirmModal from './ConfirmModal';

const STATUS_LABEL = {
  pending: 'Pending',
  'in-progress': 'In progress',
  completed: 'Completed',
};

const formatDate = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const isOverdue = (iso, status) => {
  if (!iso || status === 'completed') return false;
  const due = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
};

const TaskItem = ({ task, onEdit, onDelete, onCycleStatus }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <li className={`ticket ticket--${task.priority}`}>
      <button
        type="button"
        className={`ticket__stub ticket__stub--${task.status}`}
        onClick={() => onCycleStatus(task)}
        title="Click to advance status"
        aria-label={`Status: ${STATUS_LABEL[task.status]}. Click to advance.`}
      >
        <span className="ticket__stub-id">#{task._id.slice(-5).toUpperCase()}</span>
        <span className="ticket__stub-status">{STATUS_LABEL[task.status]}</span>
      </button>

      <div className="ticket__perforation" aria-hidden="true" />

      <div className="ticket__body">
        <div className="ticket__top">
          <h3 className={task.status === 'completed' ? 'ticket__title--done' : ''}>
            {task.title}
          </h3>
          <span className={`priority-tag priority-tag--${task.priority}`}>{task.priority}</span>
        </div>

        {task.description && <p className="ticket__desc">{task.description}</p>}

        <div className="ticket__meta">
          {task.dueDate && (
            <span className={`ticket__due ${overdue ? 'ticket__due--overdue' : ''}`}>
              {overdue ? 'Overdue · ' : 'Due '} {formatDate(task.dueDate)}
            </span>
          )}
          <span className="ticket__logged">Logged {formatDate(task.createdAt)}</span>
        </div>

        <div className="ticket__actions">
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => onEdit(task)}>
            Edit
          </button>
          <button
            type="button"
            className="btn btn--danger btn--sm"
            onClick={() => setConfirmOpen(true)}
          >
            Delete
          </button>
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Delete this task?"
        message={`"${task.title}" will be removed permanently. This can't be undone.`}
        confirmLabel="Delete"
        onConfirm={() => {
          setConfirmOpen(false);
          onDelete(task._id);
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </li>
  );
};

export default TaskItem;
