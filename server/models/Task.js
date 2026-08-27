// models/Task.js
// A Mongoose "schema" describes the shape of one document in MongoDB.
// A "model" is the class we use to actually read and write those documents.

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A task needs a title'], // custom message shown if it is missing
      trim: true,                               // removes spaces at the start/end
      maxlength: [100, 'Title cannot be longer than 100 characters'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Description cannot be longer than 500 characters'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'], // only these three values are allowed
      default: 'medium',
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    // timestamps automatically adds createdAt and updatedAt fields for us.
    timestamps: true,
  }
);

// 'Task' becomes the "tasks" collection in MongoDB (Mongoose lowercases + pluralises it).
module.exports = mongoose.model('Task', taskSchema);
