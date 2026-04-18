const router = require('express').Router()
const rateLimit = require('express-rate-limit')
const { validate } = require('../../middleware/validate')
const { verifyJWT } = require('../../middleware/auth')
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require('./auth.schema')
const ctrl = require('./auth.controller')

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 })

router.post('/register', authLimiter, validate(registerSchema), ctrl.register)
router.post('/login', authLimiter, validate(loginSchema), ctrl.login)
router.get('/me', verifyJWT, ctrl.me)
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), ctrl.forgotPassword)
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), ctrl.resetPassword)

module.exports = router
