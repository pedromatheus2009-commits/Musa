const prisma = require('../../config/database')

const postSelect = {
  id: true,
  titulo: true,
  conteudo: true,
  imagemUrl: true,
  videoUrl: true,
  publicado: true,
  createdAt: true,
  updatedAt: true,
  user: { select: { nome: true } },
}

async function list({ includeUnpublished = false } = {}) {
  return prisma.feedPost.findMany({
    where: includeUnpublished ? {} : { publicado: true },
    select: postSelect,
    orderBy: { createdAt: 'desc' },
  })
}

async function findById(id) {
  const post = await prisma.feedPost.findUnique({ where: { id }, select: postSelect })
  if (!post) {
    const err = new Error('Publicação não encontrada')
    err.status = 404
    throw err
  }
  return post
}

async function create(userId, data) {
  return prisma.feedPost.create({
    data: { userId, ...data },
    select: postSelect,
  })
}

async function update(id, data) {
  const post = await prisma.feedPost.findUnique({ where: { id } })
  if (!post) {
    const err = new Error('Publicação não encontrada')
    err.status = 404
    throw err
  }
  return prisma.feedPost.update({ where: { id }, data, select: postSelect })
}

async function remove(id) {
  await prisma.feedPost.delete({ where: { id } })
}

module.exports = { list, findById, create, update, remove }
