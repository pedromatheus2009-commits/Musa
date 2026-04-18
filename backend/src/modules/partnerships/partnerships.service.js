const prisma = require('../../config/database')

async function create(data) {
  return prisma.partnership.create({ data })
}

async function list({ lida } = {}) {
  const where = lida !== undefined ? { lida } : {}
  return prisma.partnership.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })
}

async function markRead(id) {
  return prisma.partnership.update({ where: { id }, data: { lida: true } })
}

async function remove(id) {
  await prisma.partnership.delete({ where: { id } })
}

module.exports = { create, list, markRead, remove }
