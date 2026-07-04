const prisma = require('../../prisma/client');

exports.checkIn = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const attendance = await prisma.attendance.create({
      data: {
        employeeId,
        date: new Date(),
        status: "present",
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
    const { attendanceId } = req.body;
    const attendance = await prisma.attendance.update({
      where: { id: attendanceId },
      data: { checkOut: new Date() },
    });
    res.status(200).json(attendance);
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