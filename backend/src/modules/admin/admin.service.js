const prisma = require('../../config/database')

async function listProfiles({ page = 1, limit = 20, status = 'all' }) {
  const skip = (page - 1) * limit
  const where = {}
  if (status === 'pending') where.aprovado = false
  else if (status === 'approved') where.aprovado = true

  const [data, total] = await Promise.all([
    prisma.profile.findMany({
      where,
      select: {
        id: true,
        nome: true,
        role: true,
        cidade: true,
        ativo: true,
        aprovado: true,
        createdAt: true,
        user: { select: { email: true } },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.profile.count({ where }),
  ])
  return { data, total, page, limit, pages: Math.ceil(total / limit) }
}

async function approveProfile(id) {
  return prisma.profile.update({
    where: { id },
    data: { aprovado: true, ativo: true },
    select: { id: true, nome: true, aprovado: true, ativo: true },
  })
}

async function rejectProfile(id) {
  return prisma.profile.update({
    where: { id },
    data: { aprovado: false, ativo: false },
    select: { id: true, nome: true, aprovado: true, ativo: true },
  })
}

async function deleteProfile(id) {
  await prisma.profile.delete({ where: { id } })
}

async function getStats() {
  const [totalUsers, totalProfiles, pendingProfiles, totalReviews] = await Promise.all([
    prisma.user.count(),
    prisma.profile.count({ where: { aprovado: true } }),
    prisma.profile.count({ where: { aprovado: false } }),
    prisma.review.count(),
  ])
  return { totalUsers, totalProfiles, pendingProfiles, totalReviews }
}

module.exports = { listProfiles, approveProfile, rejectProfile, deleteProfile, getStats }
