const router = require('express').Router()
const { verifyJWT } = require('../../middleware/auth')
const { requireAdmin } = require('../../middleware/admin')
const { validate } = require('../../middleware/validate')
const { createBauSchema, updateBauSchema } = require('./bau.schema')
const ctrl = require('./bau.controller')

const admin = [verifyJWT, requireAdmin]

// Admin (rotas literais antes das públicas com :id)
router.get('/admin/lista', ...admin, ctrl.listAdmin)
router.put('/:id/aprovar', ...admin, ctrl.aprovar)
router.put('/:id/recusar', ...admin, ctrl.recusar)

// Usuária logada
router.get('/meus', verifyJWT, ctrl.meus)
router.post('/', verifyJWT, validate(createBauSchema), ctrl.criar)
router.put('/:id/vendido', verifyJWT, ctrl.marcarVendido)
router.put('/:id', verifyJWT, validate(updateBauSchema), ctrl.atualizar)
router.delete('/:id', verifyJWT, ctrl.remover)

// Público
router.get('/', ctrl.listPublico)
router.get('/:id', ctrl.detalhe)

module.exports = router
