// components/TaskItem.jsx
// One row in the list. It has two looks — normal and editing — and it keeps
// that "am I being edited right now?" flag in its own local state, because no
// other component needs to know about it.

import { useState } from 'react';

// Turns the ISO date string MongoDB stores into something readable.
const formatDate = (isoString) =>
  new Date(isoString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });

function TaskItem({ task, onToggle, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);
  const [draftPriority, setDraftPriority] = useState(task.priority);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!draftTitle.trim()) {
      setError('The title cannot be empty.');
      return;
    }

    try {
      await onUpdate(task._id, { title: draftTitle.trim(), priority: draftPriority });
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    // Throw away the edits and go back to what the task actually says.
    setDraftTitle(task.title);
    setDraftPriority(task.priority);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li className={`task-item priority-${task.priority} is-editing`}>
        <div className="task-edit">
          <input
            type="text"
            className="edit-input"
            value={draftTitle}
            onChange={(event) => setDraftTitle(event.target.value)}
            maxLength={100}
            autoFocus
          />
          <select
            className="edit-select"
            value={draftPriority}
            onChange={(event) => setDraftPriority(event.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleSave}>
            Save
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleCancel}>
            Cancel
          </button>
        </div>
        {error && <p className="field-error">{error}</p>}
      </li>
    );
  }

  return (
    <li className={`task-item priority-${task.priority} ${task.completed ? 'is-done' : ''}`}>
      <input
        type="checkbox"
        className="task-check"
        checked={task.completed}
        onChange={() => onToggle(task._id)}
        aria-label={`Mark "${task.title}" as ${task.completed ? 'pending' : 'done'}`}
      />

      <div className="task-body">
        <p className="task-title">{task.title}</p>
        {task.description && <p className="task-description">{task.description}</p>}
        <div className="task-meta">
          <span className={`tag tag-${task.priority}`}>{task.priority}</span>
          <span className="task-date">Added {formatDate(task.createdAt)}</span>
        </div>
      </div>

      <div className="task-actions">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setIsEditing(true)}>
          Edit
        </button>
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(task._id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default TaskItem;
