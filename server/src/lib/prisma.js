// server/src/lib/prisma.js
// Single shared Prisma Client instance — everyone (G, D, C) should import
// from this file instead of creating their own `new PrismaClient()`.

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;