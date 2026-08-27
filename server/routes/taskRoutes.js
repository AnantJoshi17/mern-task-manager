// routes/taskRoutes.js
// This file is just a table of contents: which URL + method runs which function.

const express = require('express');
const router = express.Router();

const {
  getTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
} = require('../controllers/taskController');

// These paths are relative. In server.js we mount this router at '/api/tasks',
// so '/' below actually means '/api/tasks'.

router.route('/')
  .get(getTasks)      // GET    /api/tasks
  .post(createTask);  // POST   /api/tasks

router.route('/:id')
  .put(updateTask)      // PUT    /api/tasks/:id
  .delete(deleteTask);  // DELETE /api/tasks/:id

router.patch('/:id/toggle', toggleTask); // PATCH /api/tasks/:id/toggle

module.exports = router;
