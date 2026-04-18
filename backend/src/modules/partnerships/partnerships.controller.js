const service = require('./partnerships.service')

async function create(req, res, next) {
  try {
    const { nome, empresa, email, tipo, mensagem } = req.body
    const partnership = await service.create({ nome, empresa, email, tipo, mensagem })
    res.status(201).json(partnership)
  } catch (err) { next(err) }
}

async function list(req, res, next) {
  try {
    const { lida } = req.query
    const data = await service.list({ lida: lida !== undefined ? lida === 'true' : undefined })
    res.json(data)
  } catch (err) { next(err) }
}

async function markRead(req, res, next) {
  try {
    const partnership = await service.markRead(req.params.id)
    res.json(partnership)
  } catch (err) { next(err) }
}

async function remove(req, res, next) {
  try {
    await service.remove(req.params.id)
    res.status(204).end()
  } catch (err) { next(err) }
}

module.exports = { create, list, markRead, remove }
