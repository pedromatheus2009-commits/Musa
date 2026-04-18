const router = require('express').Router()
const { verifyJWT } = require('../../middleware/auth')
const { validate } = require('../../middleware/validate')
const { createProfileSchema, updateProfileSchema } = require('./profiles.schema')
const ctrl = require('./profiles.controller')

router.get('/', ctrl.list)
router.get('/me', verifyJWT, ctrl.getMe)
router.get('/:id', ctrl.getOne)
router.post('/', verifyJWT, validate(createProfileSchema), ctrl.create)
router.put('/:id', verifyJWT, validate(updateProfileSchema), ctrl.update)
router.delete('/:id', verifyJWT, ctrl.remove)

module.exports = router
