const express = require('express');
const router = express.Router();

const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

const { taskValidationRules, validate } = require('../middleware/validateTask');

router.route('/').get(getTasks).post(taskValidationRules, validate, createTask);

router
  .route('/:id')
  .get(getTaskById)
  .put(taskValidationRules, validate, updateTask)
  .delete(deleteTask);

module.exports = router;
