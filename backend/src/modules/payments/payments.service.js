const Stripe = require('stripe')
const prisma = require('../../config/database')
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const PRICE_ID = process.env.STRIPE_PRICE_ID
const CLIENT_URL = process.env.CORS_ORIGIN || 'http://localhost:5173'

async function createCheckoutSession(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw Object.assign(new Error('Usuário não encontrado'), { status: 404 })

  let customerId = user.stripeCustomerId

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.nome,
      metadata: { userId },
    })
    customerId = customer.id
    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customerId },
    })
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: PRICE_ID, quantity: 1 }],
    success_url: `${CLIENT_URL}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${CLIENT_URL}/planos`,
    subscription_data: {
      trial_period_days: 7,
    },
    allow_promotion_codes: true,
  })

  return { url: session.url }
}

async function createPortalSession(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user?.stripeCustomerId) {
    throw Object.assign(new Error('Sem assinatura ativa'), { status: 400 })
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${CLIENT_URL}/planos`,
  })

  return { url: session.url }
}

async function getSubscriptionStatus(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionStatus: true,
      subscriptionPeriodEnd: true,
      subscriptionId: true,
    },
  })

  return {
    status: user?.subscriptionStatus || null,
    periodEnd: user?.subscriptionPeriodEnd || null,
    active: user?.subscriptionStatus === 'active' || user?.subscriptionStatus === 'trialing',
  }
}

async function handleWebhook(rawBody, signature) {
  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch {
    throw Object.assign(new Error('Assinatura do webhook inválida'), { status: 400 })
  }

  const sub = event.data.object

  switch (event.type) {
    case 'checkout.session.completed': {
      if (sub.mode !== 'subscription') break
      const customerId = sub.customer
      const subscriptionId = sub.subscription
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      await _updateUserSubscription(customerId, subscription)
      break
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      await _updateUserSubscription(sub.customer, sub)
      break
    }
  }

  return { received: true }
}

async function _updateUserSubscription(customerId, subscription) {
  const user = await prisma.user.findUnique({ where: { stripeCustomerId: customerId } })
  if (!user) return

  const status = subscription.status
  const periodEnd = new Date(subscription.current_period_end * 1000)
  const isActive = status === 'active' || status === 'trialing'

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionId: subscription.id,
      subscriptionStatus: status,
      subscriptionPeriodEnd: periodEnd,
    },
  })

  if (user.profile) {
    await prisma.profile.updateMany({
      where: { userId: user.id },
      data: { ativo: isActive },
    })
  }
}

module.exports = { createCheckoutSession, createPortalSession, getSubscriptionStatus, handleWebhook }
