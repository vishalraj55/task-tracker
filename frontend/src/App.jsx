import React, { useEffect, useMemo, useState } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from './api/taskApi';
import { ToastProvider, useToast } from './context/ToastContext';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';

const STATUS_CYCLE = {
  pending: 'in-progress',
  'in-progress': 'completed',
  completed: 'pending',
};

const AppContent = () => {
  const { notify } = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    sortBy: 'createdAt',
  });

  const loadTasks = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.priority !== 'all') params.priority = filters.priority;
      params.sortBy = filters.sortBy;
      params.order = filters.sortBy === 'createdAt' ? 'desc' : 'asc';

      const data = await fetchTasks(params);
      setTasks(data);
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever filters change. Initial load runs on mount.
  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleCreate = async (payload) => {
    try {
      const newTask = await createTask(payload);
      setTasks((prev) => [newTask, ...prev]);
      notify('Task logged.', 'success');
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  const handleUpdate = async (payload) => {
    try {
      const updated = await updateTask(editingTask._id, payload);
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      notify('Task updated.', 'success');
      setEditingTask(null);
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      notify('Task deleted.', 'success');
      if (editingTask?._id === id) setEditingTask(null);
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  const handleCycleStatus = async (task) => {
    try {
      const nextStatus = STATUS_CYCLE[task.status];
      const updated = await updateTask(task._id, { status: nextStatus });
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  const counts = useMemo(
    () => ({
      total: tasks.length,
      completed: tasks.filter((t) => t.status === 'completed').length,
    }),
    [tasks]
  );

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-header__eyebrow">Operations Log</p>
          <h1>Task Tracker</h1>
        </div>
        <div className="app-header__counts">
          <span>
            <strong>{counts.total}</strong> open entries
          </span>
          <span>
            <strong>{counts.completed}</strong> closed
          </span>
        </div>
      </header>

      <main className="app-main">
        <section className="panel panel--form">
          <h2>{editingTask ? 'Edit entry' : 'New entry'}</h2>
          <TaskForm
            editingTask={editingTask}
            onSubmit={editingTask ? handleUpdate : handleCreate}
            onCancel={() => setEditingTask(null)}
          />
        </section>

        <section className="panel panel--list">
          <FilterBar filters={filters} onChange={setFilters} taskCount={tasks.length} />
          <TaskList
            tasks={tasks}
            loading={loading}
            onEdit={setEditingTask}
            onDelete={handleDelete}
            onCycleStatus={handleCycleStatus}
          />
        </section>
      </main>
    </div>
  );
};

const App = () => (
  <ToastProvider>
    <AppContent />
  </ToastProvider>
);

export default App;
