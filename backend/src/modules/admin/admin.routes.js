const router = require('express').Router()
const { verifyAdmin } = require('../../middleware/auth')
const ctrl = require('./admin.controller')

router.use(verifyAdmin)
router.get('/stats', ctrl.getStats)
router.get('/profiles', ctrl.listProfiles)
router.put('/profiles/:id/approve', ctrl.approveProfile)
router.put('/profiles/:id/reject', ctrl.rejectProfile)
router.delete('/profiles/:id', ctrl.deleteProfile)

module.exports = router
