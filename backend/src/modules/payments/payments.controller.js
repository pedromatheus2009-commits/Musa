const paymentsService = require('./payments.service')

async function createCheckout(req, res, next) {
  try {
    const result = await paymentsService.createCheckoutSession(req.user.sub)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

async function createPortal(req, res, next) {
  try {
    const result = await paymentsService.createPortalSession(req.user.sub)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

async function getStatus(req, res, next) {
  try {
    const result = await paymentsService.getSubscriptionStatus(req.user.sub)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

async function webhook(req, res, next) {
  try {
    const signature = req.headers['stripe-signature']
    const result = await paymentsService.handleWebhook(req.body, signature)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

module.exports = { createCheckout, createPortal, getStatus, webhook }
