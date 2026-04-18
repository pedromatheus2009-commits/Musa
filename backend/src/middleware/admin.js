const prisma = require('../config/database')

async function requireAdmin(req, res, next) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.sub },
    select: { isAdmin: true },
  })
  if (!user?.isAdmin) {
    return res.status(403).json({ error: 'Acesso restrito a administradores' })
  }
  next()
}

module.exports = { requireAdmin }
