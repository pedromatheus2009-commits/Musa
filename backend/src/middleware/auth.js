const jwt = require('jsonwebtoken')

function verifyJWT(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' })
  }
  const token = header.slice(7)
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado' })
  }
}

function verifyAdmin(req, res, next) {
  verifyJWT(req, res, () => {
    if (!req.user?.isAdmin) return res.status(403).json({ error: 'Acesso restrito a administradores' })
    next()
  })
}

module.exports = { verifyJWT, verifyAdmin }
