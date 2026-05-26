// Cria (ou atualiza) a usuária administradora a partir de variáveis de ambiente.
// A SENHA NÃO fica no código — é lida do ambiente, então este arquivo pode ser commitado.
//
// Uso local (PowerShell):
//   $env:ADMIN_EMAIL='...'; $env:ADMIN_PASSWORD='...'; $env:ADMIN_NOME='...'; node prisma/ensure-admin.js
// Em produção (Railway): defina ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NOME e rode o mesmo comando.
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

const email = process.env.ADMIN_EMAIL
const password = process.env.ADMIN_PASSWORD
const nome = process.env.ADMIN_NOME || 'Administradora'

async function main() {
  if (!email || !password) {
    console.error('Defina ADMIN_EMAIL e ADMIN_PASSWORD no ambiente.')
    process.exit(1)
  }
  const hash = await bcrypt.hash(password, 10)
  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hash, isAdmin: true },
    create: { email, password: hash, nome, isAdmin: true },
    select: { id: true, email: true, nome: true, isAdmin: true },
  })
  console.log(`✅ Admin garantido: ${user.nome} <${user.email}> (isAdmin=${user.isAdmin})`)
}

main().catch((e) => { console.error('Erro:', e.message); process.exit(1) }).finally(() => prisma.$disconnect())
