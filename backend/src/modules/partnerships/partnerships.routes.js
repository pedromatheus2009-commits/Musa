const router = require('express').Router()
const { verifyAdmin } = require('../../middleware/auth')
const ctrl = require('./partnerships.controller')

router.post('/', ctrl.create)
router.get('/', verifyAdmin, ctrl.list)
router.put('/:id/read', verifyAdmin, ctrl.markRead)
router.delete('/:id', verifyAdmin, ctrl.remove)

module.exports = router
