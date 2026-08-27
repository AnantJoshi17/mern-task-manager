// components/TaskList.jsx
// Decides what to show: a loading message, an empty state, or the tasks.

import TaskItem from './TaskItem';

const EMPTY_MESSAGES = {
  all: 'No tasks yet. Add your first one above.',
  pending: 'Nothing pending. Everything here is done.',
  completed: 'No completed tasks yet. Tick one off to see it here.',
};

function TaskList({ tasks, loading, filter, onToggle, onUpdate, onDelete }) {
  if (loading) {
    return <p className="state-message">Loading tasks…</p>;
  }

  if (tasks.length === 0) {
    return <p className="state-message">{EMPTY_MESSAGES[filter]}</p>;
  }

  return (
    <ul className="task-list">
      {/* .map turns an array of data into an array of components.
          The key prop must be unique and stable — MongoDB's _id is perfect. */}
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default TaskList;
