const express = require('express')
const { verifyJWT } = require('../../middleware/auth')
const controller = require('./payments.controller')

const router = express.Router()

// Webhook recebe raw body — registrado antes do express.json() no app.js
router.post('/webhook', express.raw({ type: 'application/json' }), controller.webhook)

router.use(verifyJWT)
router.post('/checkout', controller.createCheckout)
router.post('/portal', controller.createPortal)
router.get('/status', controller.getStatus)

module.exports = router
