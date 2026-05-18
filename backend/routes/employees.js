const express = require('express');
const router = express.Router();
const {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getEmployees)
  .post(protect, addEmployee);

router.route('/search')
  .get(protect, getEmployees);

router.route('/:id')
  .put(protect, updateEmployee)
  .delete(protect, deleteEmployee);

module.exports = router;
