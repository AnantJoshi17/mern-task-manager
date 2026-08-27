// components/TaskForm.jsx
// The "add a task" form. It keeps its own input values in local state and
// hands the finished task up to App through the onCreate prop.

import { useState } from 'react';

function TaskForm({ onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    // Without this the browser reloads the page when the form is submitted.
    event.preventDefault();

    if (!title.trim()) {
      setError('Give the task a title first.');
      return;
    }

    try {
      setSaving(true);
      await onCreate({ title: title.trim(), description: description.trim(), priority });

      // Clear the form so the next task can be typed straight away.
      setTitle('');
      setDescription('');
      setPriority('medium');
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="card task-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="title">Task</label>
        {/* This is a "controlled input": React state is the single source of
            truth, and onChange writes every keystroke back into it. */}
        <input
          id="title"
          type="text"
          placeholder="Revise Express middleware"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={100}
        />
      </div>

      <div className="field">
        <label htmlFor="description">Notes <span className="optional">optional</span></label>
        <textarea
          id="description"
          rows="2"
          placeholder="Anything you want to remember about it"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={500}
        />
      </div>

      <div className="form-footer">
        <div className="field field-inline">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Adding…' : 'Add task'}
        </button>
      </div>

      {error && <p className="field-error">{error}</p>}
    </form>
  );
}

export default TaskForm;
