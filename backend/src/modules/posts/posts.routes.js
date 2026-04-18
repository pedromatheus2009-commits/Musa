const router = require('express').Router()
const { verifyJWT } = require('../../middleware/auth')
const { validate } = require('../../middleware/validate')
const { createPostSchema, updatePostSchema } = require('./posts.schema')
const ctrl = require('./posts.controller')

router.get('/profile/:profileId', ctrl.list)
router.post('/', verifyJWT, validate(createPostSchema), ctrl.create)
router.put('/:id', verifyJWT, validate(updatePostSchema), ctrl.update)
router.delete('/:id', verifyJWT, ctrl.remove)

module.exports = router
