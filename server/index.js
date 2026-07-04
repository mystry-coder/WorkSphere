const express = require('express');
const app = express();
app.use(express.json());

// teammates will add their own lines like this:
// app.use('/api/employees', require('./routes/employee'));
// app.use('/api/attendance', require('./routes/attendance'));
// app.use('/api/leaves', require('./routes/leave'));

app.listen(5000, () => console.log('Server running on port 5000'));