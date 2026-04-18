const service = require('./feed.service')

async function list(req, res, next) {
  try {
    const posts = await service.list({ includeUnpublished: false })
    res.json(posts)
  } catch (err) { next(err) }
}

async function listAll(req, res, next) {
  try {
    const posts = await service.list({ includeUnpublished: true })
    res.json(posts)
  } catch (err) { next(err) }
}

async function getOne(req, res, next) {
  try {
    const post = await service.findById(req.params.id)
    res.json(post)
  } catch (err) { next(err) }
}

async function create(req, res, next) {
  try {
    const post = await service.create(req.user.sub, req.body)
    res.status(201).json(post)
  } catch (err) { next(err) }
}

async function update(req, res, next) {
  try {
    const post = await service.update(req.params.id, req.body)
    res.json(post)
  } catch (err) { next(err) }
}

async function remove(req, res, next) {
  try {
    await service.remove(req.params.id)
    res.status(204).end()
  } catch (err) { next(err) }
}

module.exports = { list, listAll, getOne, create, update, remove }
