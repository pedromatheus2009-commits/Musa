const service = require('./posts.service')
const prisma = require('../../config/database')

async function list(req, res, next) {
  try {
    const posts = await service.listByProfile(req.params.profileId)
    res.json(posts)
  } catch (err) { next(err) }
}

async function create(req, res, next) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.sub },
      select: { id: true },
    })
    if (!profile) return res.status(404).json({ error: 'Você precisa ter um perfil para publicar' })
    const post = await service.create(profile.id, req.body)
    res.status(201).json(post)
  } catch (err) { next(err) }
}

async function update(req, res, next) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.sub },
      select: { id: true },
    })
    if (!profile) return res.status(404).json({ error: 'Perfil não encontrado' })
    const post = await service.update(req.params.id, profile.id, req.body)
    res.json(post)
  } catch (err) { next(err) }
}

async function remove(req, res, next) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.sub },
      select: { id: true },
    })
    if (!profile) return res.status(404).json({ error: 'Perfil não encontrado' })
    await service.remove(req.params.id, profile.id)
    res.status(204).end()
  } catch (err) { next(err) }
}

module.exports = { list, create, update, remove }
