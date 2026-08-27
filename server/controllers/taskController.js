// controllers/taskController.js
// A controller holds the actual logic for each route.
// Keeping it separate from routes/ makes each file easy to read and test.

const Task = require('../models/Task');

// GET /api/tasks?status=pending&search=milk
// Returns every task, newest first. Optional filters come in as query params.
const getTasks = async (req, res) => {
  try {
    const { status, search } = req.query;

    // We build a plain JS object and hand it to MongoDB as the filter.
    const filter = {};

    if (status === 'completed') filter.completed = true;
    if (status === 'pending') filter.completed = false;

    if (search) {
      // $regex = "contains", 'i' = case-insensitive.
      filter.title = { $regex: search, $options: 'i' };
    }

    // sort({ createdAt: -1 }) means newest first. 1 would be oldest first.
    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch tasks', error: error.message });
  }
};

// POST /api/tasks
// Creates one task from the JSON body the React app sends.
const createTask = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    if (!title || title.trim() === '') {
      // 400 = the client sent something invalid.
      return res.status(400).json({ message: 'A task needs a title' });
    }

    const task = await Task.create({ title, description, priority });

    // 201 = created successfully.
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: 'Could not create task', error: error.message });
  }
};

// PUT /api/tasks/:id
// Replaces the editable fields of one task.
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      // 404 = we looked, and that id does not exist.
      return res.status(404).json({ message: 'Task not found' });
    }

    // ?? means "use the new value, unless it is null/undefined".
    task.title = req.body.title ?? task.title;
    task.description = req.body.description ?? task.description;
    task.priority = req.body.priority ?? task.priority;
    task.completed = req.body.completed ?? task.completed;

    // .save() runs the schema validation rules again before writing.
    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: 'Could not update task', error: error.message });
  }
};

// PATCH /api/tasks/:id/toggle
// Flips completed true <-> false. A separate route because the checkbox
// should not have to send the whole task object back.
const toggleTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.completed = !task.completed;
    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: 'Could not update task', error: error.message });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // We send the id back so React knows which item to remove from state.
    res.status(200).json({ message: 'Task deleted', id: req.params.id });
  } catch (error) {
    res.status(400).json({ message: 'Could not delete task', error: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, toggleTask, deleteTask };
