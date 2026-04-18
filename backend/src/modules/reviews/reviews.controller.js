const service = require('./reviews.service')

async function list(req, res, next) {
  try {
    const reviews = await service.listByProfile(req.params.profileId)
    res.json(reviews)
  } catch (err) { next(err) }
}

async function create(req, res, next) {
  try {
    const review = await service.create(req.params.profileId, req.body)
    res.status(201).json(review)
  } catch (err) { next(err) }
}

module.exports = { list, create }
