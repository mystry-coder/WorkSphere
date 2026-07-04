// server/src/controllers/authController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

const SALT_ROUNDS = 10;

// Password rule: min 8 chars, at least one number, at least one symbol
function isPasswordValid(password) {
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>_\-+=]/.test(password);
  return hasMinLength && hasNumber && hasSymbol;
}

async function signup(req, res) {
  try {
    const { employeeId, email, password, role, name } = req.body;

    if (!employeeId || !email || !password || !role) {
      return res.status(400).json({
        error: 'employeeId, email, password, and role are all required',
      });
    }

    if (!['ADMIN', 'EMPLOYEE'].includes(role)) {
      return res.status(400).json({ error: 'role must be ADMIN or EMPLOYEE' });
    }

    if (!isPasswordValid(password)) {
      return res.status(400).json({
        error:
          'Password must be at least 8 characters and include at least one number and one symbol',
      });
    }

    // Check for existing user with this email or employeeId
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { employeeId }],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'A user with this email or employee ID already exists',
      });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create User and linked Employee record together
    const user = await prisma.user.create({
      data: {
        employeeId,
        email,
        passwordHash,
        role,
        employee: {
          create: {
            name: name || employeeId, // placeholder until Profile module fills this in
          },
        },
      },
      include: { employee: true },
    });

    // Stub — replace with a real email service later if needed
    console.log(`(stub) Verification email would be sent to ${email}`);

    return res.status(201).json({
      message: 'Signup successful',
      user: {
        id: user.id,
        employeeId: user.employeeId,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Something went wrong during signup' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Same generic error whether email or password is wrong — avoids
    // leaking which one was incorrect to a potential attacker.
    const genericError = { error: 'Invalid email or password' };

    if (!user) {
      return res.status(401).json(genericError);
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json(genericError);
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        employeeId: user.employeeId,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Something went wrong during login' });
  }
}

module.exports = { signup, login };