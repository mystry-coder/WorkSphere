const express = require('express');
const router = express.Router();
const {
  checkIn,
  checkOut,
  getAllAttendance,
  getEmployeeAttendance,
} = require('../controllers/attendanceController');

router.post('/checkin', checkIn);
router.post('/checkout', checkOut);
router.get('/', getAllAttendance);
router.get('/:employeeId', getEmployeeAttendance);

module.exports = router;