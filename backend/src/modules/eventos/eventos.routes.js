const router = require('express').Router()
const { verifyJWT } = require('../../middleware/auth')
const { requireAdmin } = require('../../middleware/admin')
const { validate } = require('../../middleware/validate')
const { createEventoSchema, updateEventoSchema, checkoutSchema, inscricaoManualSchema } = require('./eventos.schema')
const ctrl = require('./eventos.controller')

const admin = [verifyJWT, requireAdmin]

// Admin (rotas literais antes das públicas com :id)
router.get('/admin/lista', ...admin, ctrl.listarAdmin)
router.post('/', ...admin, validate(createEventoSchema), ctrl.criar)
router.put('/:id', ...admin, validate(updateEventoSchema), ctrl.atualizar)
router.delete('/:id', ...admin, ctrl.remover)
router.get('/:id/inscricoes', ...admin, ctrl.listarInscricoes)
router.post('/:id/inscricoes/manual', ...admin, validate(inscricaoManualSchema), ctrl.inscricaoManual)

// Público
router.get('/', ctrl.agenda)
router.get('/:id', ctrl.detalhe)
router.post('/:id/checkout', validate(checkoutSchema), ctrl.checkout)

module.exports = router
