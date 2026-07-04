// server/src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
// Teammates will add their own lines here as they finish their modules:
// const employeeRoutes = require('./routes/employee');
// const attendanceRoutes = require('./routes/attendance');
// const leaveRoutes = require('./routes/leave');
// const payrollRoutes = require('./routes/payroll');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
// app.use('/api/employees', employeeRoutes);
// app.use('/api/attendance', attendanceRoutes);
// app.use('/api/leaves', leaveRoutes);
// app.use('/api/payroll', payrollRoutes);

app.get('/', (req, res) => res.send('Worksphere API is running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));