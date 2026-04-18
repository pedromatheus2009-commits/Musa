const prisma = require('../../config/database')

const reviewSelect = {
  id: true,
  autorNome: true,
  nota: true,
  comentario: true,
  createdAt: true,
}

async function listByProfile(profileId) {
  return prisma.review.findMany({
    where: { profileId },
    select: reviewSelect,
    orderBy: { createdAt: 'desc' },
  })
}

async function create(profileId, data) {
  const profile = await prisma.profile.findUnique({ where: { id: profileId }, select: { id: true } })
  if (!profile) {
    const err = new Error('Perfil não encontrado')
    err.status = 404
    throw err
  }
  return prisma.review.create({
    data: { profileId, ...data },
    select: reviewSelect,
  })
}

module.exports = { listByProfile, create }
