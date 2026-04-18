const router = require('express').Router()
const { verifyJWT } = require('../../middleware/auth')
const { requireAdmin } = require('../../middleware/admin')
const { validate } = require('../../middleware/validate')
const { createFeedPostSchema, updateFeedPostSchema } = require('./feed.schema')
const ctrl = require('./feed.controller')

// Público
router.get('/', ctrl.list)
router.get('/:id', ctrl.getOne)

// Admin only
router.get('/admin/all', verifyJWT, requireAdmin, ctrl.listAll)
router.post('/', verifyJWT, requireAdmin, validate(createFeedPostSchema), ctrl.create)
router.put('/:id', verifyJWT, requireAdmin, validate(updateFeedPostSchema), ctrl.update)
router.delete('/:id', verifyJWT, requireAdmin, ctrl.remove)

module.exports = router
