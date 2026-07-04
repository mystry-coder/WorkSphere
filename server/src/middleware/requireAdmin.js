// server/src/middleware/requireAdmin.js
// Must run AFTER the `auth` middleware, since it relies on req.user
// already being set. Blocks non-admins with a 403.

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

module.exports = requireAdmin;