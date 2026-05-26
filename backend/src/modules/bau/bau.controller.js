const service = require('./bau.service')

const wrap = (fn) => async (req, res, next) => {
  try { await fn(req, res, next) } catch (e) { next(e) }
}

const listPublico = wrap(async (req, res) => {
  const { q, tipo, categoria } = req.query
  res.json(await service.listPublico({ q, tipo, categoria }))
})
const detalhe = wrap(async (req, res) => res.json(await service.detalhe(req.params.id)))
const criar = wrap(async (req, res) => res.status(201).json(await service.criar(req.user.sub, req.body)))
const meus = wrap(async (req, res) => res.json(await service.meus(req.user.sub)))
const atualizar = wrap(async (req, res) => res.json(await service.atualizar(req.params.id, req.user.sub, req.body)))
const marcarVendido = wrap(async (req, res) => res.json(await service.marcarVendido(req.params.id, req.user.sub)))
const remover = wrap(async (req, res) => { await service.remover(req.params.id, req.user.sub); res.status(204).end() })
const listAdmin = wrap(async (req, res) => res.json(await service.listAdmin({ status: req.query.status })))
const aprovar = wrap(async (req, res) => res.json(await service.aprovar(req.params.id)))
const recusar = wrap(async (req, res) => res.json(await service.recusar(req.params.id)))

module.exports = { listPublico, detalhe, criar, meus, atualizar, marcarVendido, remover, listAdmin, aprovar, recusar }
