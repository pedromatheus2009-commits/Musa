const Stripe = require('stripe')
const prisma = require('../../config/database')
const whatsapp = require('../../services/whatsapp')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const CLIENT_URL = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',')[0]
const PAYMENT_METHODS = (process.env.STRIPE_PAYMENT_METHODS || 'card,pix').split(',').map((m) => m.trim())
const HOLD_MINUTES = 30

const err = (message, status) => Object.assign(new Error(message), { status })

const publicSelect = {
  id: true, tipo: true, titulo: true, descricao: true, dataHora: true,
  duracaoMin: true, local: true, online: true, linkOnline: true,
  preco: true, vagas: true, imagemUrl: true, status: true, createdAt: true,
}

// Vagas ocupadas = confirmadas + holds (aguardando pagamento) ainda válidos.
function contarOcupadas(client, eventoId) {
  return client.inscricao.count({
    where: {
      eventoId,
      OR: [
        { status: 'confirmada' },
        { status: 'aguardando_pagamento', holdExpiresAt: { gt: new Date() } },
      ],
    },
  })
}

async function comVagas(evento) {
  const ocupadas = await contarOcupadas(prisma, evento.id)
  return { ...evento, vagasRestantes: Math.max(0, evento.vagas - ocupadas), esgotado: ocupadas >= evento.vagas }
}

// ----------------------------- público -----------------------------
async function listarAgenda({ mes, ano } = {}) {
  const where = { status: { in: ['publicado', 'lotado'] } }
  if (mes && ano) {
    where.dataHora = { gte: new Date(Date.UTC(ano, mes - 1, 1)), lt: new Date(Date.UTC(ano, mes, 1)) }
  } else {
    where.dataHora = { gte: new Date(Date.now() - 86400000) }
  }
  const eventos = await prisma.evento.findMany({ where, select: publicSelect, orderBy: { dataHora: 'asc' }, take: 200 })
  return Promise.all(eventos.map(comVagas))
}

async function detalhe(id) {
  const evento = await prisma.evento.findUnique({ where: { id }, select: publicSelect })
  if (!evento || !['publicado', 'lotado'].includes(evento.status)) throw err('Evento não encontrado', 404)
  return comVagas(evento)
}

// ----------------------------- checkout -----------------------------
async function iniciarCheckout(eventoId, dados) {
  const evento = await prisma.evento.findUnique({ where: { id: eventoId } })
  if (!evento || evento.status !== 'publicado') throw err('Evento não disponível para inscrição', 400)

  // Reserva a vaga de forma atômica: lock da linha do evento serializa concorrentes.
  const inscricao = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM eventos WHERE id = ${eventoId} FOR UPDATE`
    const ocupadas = await contarOcupadas(tx, eventoId)
    if (ocupadas >= evento.vagas) throw err('Evento esgotado', 409)
    return tx.inscricao.create({
      data: {
        eventoId,
        nome: dados.nome,
        email: dados.email,
        whatsapp: dados.whatsapp,
        status: 'aguardando_pagamento',
        origem: 'online',
        holdExpiresAt: new Date(Date.now() + HOLD_MINUTES * 60000),
      },
    })
  })

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: PAYMENT_METHODS,
    customer_email: dados.email,
    line_items: [{
      quantity: 1,
      price_data: {
        currency: 'brl',
        unit_amount: evento.preco,
        product_data: {
          name: evento.titulo,
          description: `${evento.tipo} • ${new Date(evento.dataHora).toLocaleString('pt-BR')}`,
        },
      },
    }],
    expires_at: Math.floor(Date.now() / 1000) + HOLD_MINUTES * 60,
    success_url: `${CLIENT_URL}/agenda?compra=sucesso`,
    cancel_url: `${CLIENT_URL}/agenda`,
    metadata: { inscricaoId: inscricao.id, eventoId },
  })

  await prisma.inscricao.update({ where: { id: inscricao.id }, data: { stripeSessionId: session.id } })
  return { url: session.url }
}

// ----------------------------- webhook -----------------------------
async function confirmarInscricaoPorSessao(session) {
  const inscricaoId = session.metadata?.inscricaoId
  if (!inscricaoId) return
  const existing = await prisma.inscricao.findUnique({ where: { id: inscricaoId } })
  if (!existing || existing.status === 'confirmada') return // idempotente

  let soldOut = false
  const result = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM eventos WHERE id = ${existing.eventoId} FOR UPDATE`
    const inscricao = await tx.inscricao.update({
      where: { id: inscricaoId },
      data: { status: 'confirmada', valorPago: session.amount_total ?? null, holdExpiresAt: null },
      include: { evento: true },
    })
    const confirmadas = await tx.inscricao.count({ where: { eventoId: inscricao.eventoId, status: 'confirmada' } })
    if (confirmadas >= inscricao.evento.vagas && inscricao.evento.status === 'publicado') {
      await tx.evento.update({ where: { id: inscricao.eventoId }, data: { status: 'lotado' } })
      soldOut = true
    }
    return inscricao
  })

  // Notificações não devem derrubar o webhook.
  whatsapp.enviarConfirmacaoCompra(result, result.evento).catch(() => {})
  whatsapp.notificarAdminNovaInscricao(result, result.evento).catch(() => {})
  if (soldOut) whatsapp.notificarAdminLotado(result.evento).catch(() => {})
}

async function expirarSessao(session) {
  const inscricaoId = session.metadata?.inscricaoId
  if (!inscricaoId) return
  await prisma.inscricao.updateMany({
    where: { id: inscricaoId, status: 'aguardando_pagamento' },
    data: { status: 'expirada' },
  })
}

// ----------------------------- admin -----------------------------
async function assertEvento(id) {
  const evento = await prisma.evento.findUnique({ where: { id } })
  if (!evento) throw err('Evento não encontrado', 404)
  return evento
}

function criar(adminId, dados) {
  return prisma.evento.create({ data: { ...dados, createdById: adminId } })
}

async function atualizar(id, dados) {
  await assertEvento(id)
  return prisma.evento.update({ where: { id }, data: dados })
}

async function remover(id) {
  await assertEvento(id)
  return prisma.evento.delete({ where: { id } })
}

async function listarAdmin() {
  const eventos = await prisma.evento.findMany({ orderBy: { dataHora: 'desc' } })
  return Promise.all(eventos.map(async (e) => {
    const confirmadas = await prisma.inscricao.count({ where: { eventoId: e.id, status: 'confirmada' } })
    return { ...e, confirmadas, lotacaoPct: e.vagas ? Math.round((confirmadas / e.vagas) * 100) : 0 }
  }))
}

async function listarInscricoes(eventoId) {
  const evento = await assertEvento(eventoId)
  const inscricoes = await prisma.inscricao.findMany({
    where: { eventoId },
    orderBy: { createdAt: 'asc' },
    select: { id: true, nome: true, email: true, whatsapp: true, status: true, origem: true, valorPago: true, createdAt: true },
  })
  const confirmadas = inscricoes.filter((i) => i.status === 'confirmada').length
  return { evento, inscricoes, confirmadas, lotacaoPct: evento.vagas ? Math.round((confirmadas / evento.vagas) * 100) : 0 }
}

async function inscricaoManual(eventoId, dados) {
  const evento = await assertEvento(eventoId)
  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM eventos WHERE id = ${eventoId} FOR UPDATE`
    const confirmadas = await tx.inscricao.count({ where: { eventoId, status: 'confirmada' } })
    if (confirmadas >= evento.vagas) throw err('Evento esgotado', 409)
    const inscricao = await tx.inscricao.create({
      data: {
        eventoId,
        nome: dados.nome,
        email: dados.email || `manual+${Date.now()}@musacasa.com.br`,
        whatsapp: dados.whatsapp || '5500000000000',
        status: 'confirmada',
        origem: 'manual',
      },
    })
    if (confirmadas + 1 >= evento.vagas && evento.status === 'publicado') {
      await tx.evento.update({ where: { id: eventoId }, data: { status: 'lotado' } })
    }
    return inscricao
  })
}

module.exports = {
  listarAgenda, detalhe, iniciarCheckout, confirmarInscricaoPorSessao, expirarSessao,
  criar, atualizar, remover, listarAdmin, listarInscricoes, inscricaoManual,
}
