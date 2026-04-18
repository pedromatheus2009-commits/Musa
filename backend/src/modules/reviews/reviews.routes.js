const router = require('express').Router()
const { z } = require('zod')
const { validate } = require('../../middleware/validate')
const ctrl = require('./reviews.controller')

const createReviewSchema = z.object({
  autorNome: z.string().min(2).max(100),
  nota: z.number().int().min(1).max(5),
  comentario: z.string().max(1000).optional(),
})

router.get('/:profileId', ctrl.list)
router.post('/:profileId', validate(createReviewSchema), ctrl.create)

module.exports = router
