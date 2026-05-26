const router = require('express').Router()
const { z } = require('zod')
const rateLimit = require('express-rate-limit')
const { validate } = require('../../middleware/validate')
const ctrl = require('./reviews.controller')

const createReviewSchema = z.object({
  autorNome: z.string().min(2).max(100),
  nota: z.number().int().min(1).max(5),
  comentario: z.string().max(1000).optional(),
})

// Anti-spam: máximo de 5 avaliações por hora por IP.
const reviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Muitas avaliações em pouco tempo. Tente novamente mais tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
})

router.get('/:profileId', ctrl.list)
router.post('/:profileId', reviewLimiter, validate(createReviewSchema), ctrl.create)

module.exports = router
