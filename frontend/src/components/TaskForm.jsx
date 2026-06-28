import React, { useEffect, useState } from 'react';

const emptyForm = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  dueDate: '',
};

const TaskForm = ({ editingTask, onSubmit, onCancel }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title || '',
        description: editingTask.description || '',
        status: editingTask.status || 'pending',
        priority: editingTask.priority || 'medium',
        dueDate: editingTask.dueDate ? editingTask.dueDate.slice(0, 10) : '',
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [editingTask]);

  const validate = () => {
    const next = {};
    const title = form.title.trim();

    if (!title) {
      next.title = 'Give this task a title.';
    } else if (title.length < 3) {
      next.title = 'Title needs at least 3 characters.';
    } else if (title.length > 100) {
      next.title = 'Title cannot exceed 100 characters.';
    }

    if (form.description.trim().length > 500) {
      next.description = 'Description cannot exceed 500 characters.';
    }

    if (form.dueDate) {
      const chosen = new Date(form.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (!editingTask && chosen < today) {
        next.dueDate = 'Due date cannot be in the past.';
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      dueDate: form.dueDate || null,
    });
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="task-form__row">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          placeholder="e.g. Refactor auth middleware"
          value={form.title}
          onChange={handleChange('title')}
          aria-invalid={Boolean(errors.title)}
        />
        {errors.title && <span className="field-error">{errors.title}</span>}
      </div>

      <div className="task-form__row">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          placeholder="Optional details, context, or links"
          rows={3}
          value={form.description}
          onChange={handleChange('description')}
        />
        {errors.description && <span className="field-error">{errors.description}</span>}
      </div>

      <div className="task-form__grid">
        <div className="task-form__row">
          <label htmlFor="status">Status</label>
          <select id="status" value={form.status} onChange={handleChange('status')}>
            <option value="pending">Pending</option>
            <option value="in-progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="task-form__row">
          <label htmlFor="priority">Priority</label>
          <select id="priority" value={form.priority} onChange={handleChange('priority')}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="task-form__row">
          <label htmlFor="dueDate">Due date</label>
          <input
            id="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange('dueDate')}
          />
          {errors.dueDate && <span className="field-error">{errors.dueDate}</span>}
        </div>
      </div>

      <div className="task-form__actions">
        {editingTask && (
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn--primary">
          {editingTask ? 'Save changes' : 'Log task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
