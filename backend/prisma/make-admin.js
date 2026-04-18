const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const email = process.argv[2]

if (!email) {
  console.error('Uso: node prisma/make-admin.js seu@email.com')
  process.exit(1)
}

async function main() {
  const user = await prisma.user.update({
    where: { email },
    data: { isAdmin: true },
    select: { id: true, nome: true, email: true, isAdmin: true },
  })
  console.log(`✅ ${user.nome} (${user.email}) agora é admin!`)
}

main()
  .catch((e) => { console.error('Erro:', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
