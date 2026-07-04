// server/src/controllers/attendanceController.js
const prisma = require('../lib/prisma');

exports.checkIn = async (req, res) => {
  try {
    // req.user.id comes from the JWT (auth middleware) — it's the User id,
    // so we look up the linked Employee record first.
    const employee = await prisma.employee.findUnique({
      where: { userId: req.user.id },
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee profile not found for this user' });
    }

    const attendance = await prisma.attendance.create({
      data: {
        employeeId: employee.id,
        date: new Date(),
        status: 'Present',
        checkIn: new Date(),
      },
    });
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { userId: req.user.id },
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee profile not found for this user' });
    }

    // Find today's open attendance record for this employee instead of
    // requiring the frontend to know/send an attendanceId
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        date: { gte: today },
        checkOut: null,
      },
      orderBy: { checkIn: 'desc' },
    });

    if (!attendance) {
      return res.status(404).json({ error: 'No open check-in found for today' });
    }

    const updated = await prisma.attendance.update({
      where: { id: attendance.id },
      data: { checkOut: new Date() },
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllAttendance = async (req, res) => {
  try {
    const records = await prisma.attendance.findMany({
      include: { employee: true },
    });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEmployeeAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const records = await prisma.attendance.findMany({
      where: { employeeId: parseInt(employeeId) },
    });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};