// App.jsx
// The parent component. It owns all the shared state and passes both the data
// and the functions that change it down to the smaller components.

import { useState, useEffect } from 'react';
import * as api from './api';

import TaskForm from './components/TaskForm';
import Toolbar from './components/Toolbar';
import ProgressStrip from './components/ProgressStrip';
import TaskList from './components/TaskList';

function App() {
  // ---- State: any value that changes and should redraw the screen ----
  const [tasks, setTasks] = useState([]);       // tasks currently loaded from the API
  const [search, setSearch] = useState('');     // text in the search box
  const [filter, setFilter] = useState('all');  // 'all' | 'pending' | 'completed'
  const [loading, setLoading] = useState(true); // true while a request is in flight
  const [error, setError] = useState('');       // message to show if a request fails

  // ---- Load tasks whenever the search text changes ----
  useEffect(() => {
    // Debounce: wait 400ms after the last keystroke before calling the API,
    // so typing "report" sends one request instead of six.
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await api.fetchTasks({ search });
        setTasks(data);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 400);

    // React runs this cleanup before the next effect. It cancels the pending
    // timer, which is what makes the debounce work.
    return () => clearTimeout(timer);
  }, [search]); // re-run only when `search` changes

  // ---- Handlers: each one calls the API, then updates state with the result ----

  const handleCreate = async (newTask) => {
    const created = await api.createTask(newTask);
    // Put the new task at the top. We never mutate state directly, we build a
    // brand new array — that is how React knows something changed.
    setTasks((previous) => [created, ...previous]);
  };

  const handleToggle = async (id) => {
    try {
      const updated = await api.toggleTask(id);
      setTasks((previous) => previous.map((task) => (task._id === id ? updated : task)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (id, updates) => {
    const updated = await api.updateTask(id, updates);
    setTasks((previous) => previous.map((task) => (task._id === id ? updated : task)));
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteTask(id);
      setTasks((previous) => previous.filter((task) => task._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // ---- Derived values: calculated from state, not stored in state ----
  // The status filter runs here in the browser because we already have the data.
  const visibleTasks = tasks.filter((task) => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const doneCount = tasks.filter((task) => task.completed).length;

  return (
    <div className="app">
      <header className="header">
        <p className="eyebrow">MERN stack</p>
        <h1 className="title">Task Manager</h1>
        <p className="subtitle">
          MongoDB stores it, Express serves it, React shows it, Node runs it.
        </p>
      </header>

      <ProgressStrip total={tasks.length} done={doneCount} />

      <TaskForm onCreate={handleCreate} />

      <Toolbar
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        counts={{
          all: tasks.length,
          pending: tasks.length - doneCount,
          completed: doneCount,
        }}
      />

      {error && <p className="error-banner">{error}</p>}

      <TaskList
        tasks={visibleTasks}
        loading={loading}
        filter={filter}
        onToggle={handleToggle}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
