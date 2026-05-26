const service = require('./eventos.service')

const wrap = (fn) => async (req, res, next) => {
  try { await fn(req, res, next) } catch (e) { next(e) }
}

// público
const agenda = wrap(async (req, res) => {
  const { mes, ano } = req.query
  res.json(await service.listarAgenda({ mes: mes ? Number(mes) : undefined, ano: ano ? Number(ano) : undefined }))
})
const detalhe = wrap(async (req, res) => res.json(await service.detalhe(req.params.id)))
const checkout = wrap(async (req, res) => res.json(await service.iniciarCheckout(req.params.id, req.body)))

// admin
const criar = wrap(async (req, res) => res.status(201).json(await service.criar(req.user.sub, req.body)))
const atualizar = wrap(async (req, res) => res.json(await service.atualizar(req.params.id, req.body)))
const remover = wrap(async (req, res) => { await service.remover(req.params.id); res.status(204).end() })
const listarAdmin = wrap(async (req, res) => res.json(await service.listarAdmin()))
const listarInscricoes = wrap(async (req, res) => res.json(await service.listarInscricoes(req.params.id)))
const inscricaoManual = wrap(async (req, res) => res.status(201).json(await service.inscricaoManual(req.params.id, req.body)))

module.exports = { agenda, detalhe, checkout, criar, atualizar, remover, listarAdmin, listarInscricoes, inscricaoManual }
