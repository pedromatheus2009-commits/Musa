const service = require('./admin.service')

async function listProfiles(req, res, next) {
  try {
    const { page, limit, status } = req.query
    const result = await service.listProfiles({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      status: status || 'all',
    })
    res.json(result)
  } catch (err) { next(err) }
}

async function approveProfile(req, res, next) {
  try {
    const profile = await service.approveProfile(req.params.id)
    res.json(profile)
  } catch (err) { next(err) }
}

async function rejectProfile(req, res, next) {
  try {
    const profile = await service.rejectProfile(req.params.id)
    res.json(profile)
  } catch (err) { next(err) }
}

async function deleteProfile(req, res, next) {
  try {
    await service.deleteProfile(req.params.id)
    res.status(204).end()
  } catch (err) { next(err) }
}

async function getStats(req, res, next) {
  try {
    const stats = await service.getStats()
    res.json(stats)
  } catch (err) { next(err) }
}

module.exports = { listProfiles, approveProfile, rejectProfile, deleteProfile, getStats }
