const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const {
  checkIn,
  checkOut,
  getAllAttendance,
  getEmployeeAttendance,
} = require('../controllers/attendanceController');

// Any logged-in employee can check themselves in/out
router.post('/checkin', auth, checkIn);
router.post('/checkout', auth, checkOut);

// Admin-only: view everyone's records or a specific employee's records
router.get('/', auth, requireAdmin, getAllAttendance);
router.get('/:employeeId', auth, requireAdmin, getEmployeeAttendance);

module.exports = router;