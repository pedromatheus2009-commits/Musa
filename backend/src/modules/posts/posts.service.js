const prisma = require('../../config/database')

const postSelect = {
  id: true,
  titulo: true,
  conteudo: true,
  imagemUrl: true,
  videoUrl: true,
  createdAt: true,
  updatedAt: true,
}

async function listByProfile(profileId) {
  return prisma.post.findMany({
    where: { profileId },
    select: postSelect,
    orderBy: { createdAt: 'desc' },
  })
}

async function create(profileId, data) {
  return prisma.post.create({
    data: { profileId, ...data },
    select: postSelect,
  })
}

async function update(id, profileId, data) {
  await assertOwner(id, profileId)
  return prisma.post.update({
    where: { id },
    data,
    select: postSelect,
  })
}

async function remove(id, profileId) {
  await assertOwner(id, profileId)
  await prisma.post.delete({ where: { id } })
}

async function assertOwner(id, profileId) {
  const post = await prisma.post.findUnique({ where: { id }, select: { profileId: true } })
  if (!post) {
    const err = new Error('Publicação não encontrada')
    err.status = 404
    throw err
  }
  if (post.profileId !== profileId) {
    const err = new Error('Sem permissão')
    err.status = 403
    throw err
  }
}

module.exports = { listByProfile, create, update, remove }
