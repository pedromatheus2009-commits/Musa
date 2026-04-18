const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const prisma = require('../../config/database')

async function register({ email, password, nome }) {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    const err = new Error('Email já cadastrado')
    err.status = 409
    throw err
  }
  const hash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { email, password: hash, nome },
    select: { id: true, email: true, nome: true, isAdmin: true, createdAt: true },
  })
  const token = signToken(user.id)
  return { user, token }
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    const err = new Error('Credenciais inválidas')
    err.status = 401
    throw err
  }
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    const err = new Error('Credenciais inválidas')
    err.status = 401
    throw err
  }
  const token = signToken(user.id)
  const { password: _pw, ...safe } = user
  return { user: { ...safe, isAdmin: user.isAdmin }, token }
}

async function me(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, nome: true, isAdmin: true, createdAt: true, profile: { select: { id: true } } },
  })
  if (!user) {
    const err = new Error('Usuária não encontrada')
    err.status = 404
    throw err
  }
  return user
}

async function forgotPassword(email) {
  const user = await prisma.user.findUnique({ where: { email } })
  // Sempre retorna sucesso para não revelar se o email existe
  if (!user) return

  // Invalida tokens anteriores deste usuário
  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } })

  const rawToken = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

  await prisma.passwordResetToken.create({
    data: { userId: user.id, token: rawToken, expiresAt },
  })

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/redefinir-senha?token=${rawToken}`

  if (!process.env.RESEND_API_KEY) {
    console.log(`\n🔑 [DEV] Link de redefinição para ${email}:\n${resetUrl}\n`)
    return
  }

  const { Resend } = require('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: 'MUSA <noreply@musacasa.com.br>',
    to: email,
    subject: 'Redefinir senha — MUSA',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
        <h2 style="color:#b8436e">MUSA — Redefinir senha</h2>
        <p>Olá, ${user.nome}!</p>
        <p>Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo:</p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 28px;background:#b8436e;color:#fff;border-radius:999px;text-decoration:none;font-weight:bold;margin:16px 0">
          Redefinir senha
        </a>
        <p style="color:#888;font-size:13px">Este link expira em 1 hora. Se você não solicitou isso, ignore este email.</p>
      </div>
    `,
  })
}

async function resetPassword(token, newPassword) {
  const record = await prisma.passwordResetToken.findUnique({ where: { token } })

  if (!record) {
    const err = new Error('Link inválido ou expirado')
    err.status = 400
    throw err
  }

  if (record.expiresAt < new Date()) {
    await prisma.passwordResetToken.delete({ where: { token } })
    const err = new Error('Este link expirou. Solicite um novo.')
    err.status = 400
    throw err
  }

  const hash = await bcrypt.hash(newPassword, 10)
  await prisma.user.update({ where: { id: record.userId }, data: { password: hash } })
  await prisma.passwordResetToken.delete({ where: { token } })
}

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

module.exports = { register, login, me, forgotPassword, resetPassword }
