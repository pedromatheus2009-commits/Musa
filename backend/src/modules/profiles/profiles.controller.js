const service = require('./profiles.service')

async function list(req, res, next) {
  try {
    const { q, categoria, cidade, estado, page, limit } = req.query
    const result = await service.list({
      q, categoria, cidade, estado,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 12,
    })
    res.json(result)
  } catch (err) { next(err) }
}

async function getOne(req, res, next) {
  try {
    const profile = await service.findById(req.params.id)
    res.json(profile)
  } catch (err) { next(err) }
}

async function create(req, res, next) {
  try {
    const profile = await service.create(req.user.sub, req.body)
    res.status(201).json(profile)
  } catch (err) { next(err) }
}

async function update(req, res, next) {
  try {
    const profile = await service.update(req.params.id, req.user.sub, req.body)
    res.json(profile)
  } catch (err) { next(err) }
}

async function remove(req, res, next) {
  try {
    await service.remove(req.params.id, req.user.sub)
    res.status(204).end()
  } catch (err) { next(err) }
}

async function getMe(req, res, next) {
  try {
    const profile = await service.findByUser(req.user.sub)
    res.json(profile || null)
  } catch (err) { next(err) }
}

module.exports = { list, getOne, create, update, remove, getMe }
