const cron = require('node-cron')
const prisma = require('../config/database')
const whatsapp = require('../services/whatsapp')

const TZ = process.env.TZ || 'America/Sao_Paulo'

// Envia lembrete de WhatsApp para inscritos confirmados em eventos de amanhã.
// Idempotente: só envia se lembreteEnviadoEm ainda é null.
async function enviarLembretes() {
  const amanhaInicio = new Date(); amanhaInicio.setDate(amanhaInicio.getDate() + 1); amanhaInicio.setHours(0, 0, 0, 0)
  const amanhaFim = new Date(amanhaInicio); amanhaFim.setHours(23, 59, 59, 999)

  const inscricoes = await prisma.inscricao.findMany({
    where: {
      status: 'confirmada',
      lembreteEnviadoEm: null,
      evento: { dataHora: { gte: amanhaInicio, lte: amanhaFim }, status: { in: ['publicado', 'lotado'] } },
    },
    include: { evento: true },
  })

  for (const insc of inscricoes) {
    await whatsapp.enviarLembrete(insc, insc.evento).catch((e) => console.error('[jobs] lembrete whatsapp:', e.message))
    await prisma.inscricao.update({ where: { id: insc.id }, data: { lembreteEnviadoEm: new Date() } })
  }
  if (inscricoes.length) console.log(`[jobs] lembretes enviados: ${inscricoes.length}`)
}

// Libera vagas de holds vencidos (quem iniciou o pagamento e não concluiu).
async function expirarHolds() {
  const r = await prisma.inscricao.updateMany({
    where: { status: 'aguardando_pagamento', holdExpiresAt: { lt: new Date() } },
    data: { status: 'expirada' },
  })
  if (r.count) console.log(`[jobs] holds expirados: ${r.count}`)
}

function start() {
  cron.schedule('0 9 * * *', enviarLembretes, { timezone: TZ })
  cron.schedule('*/5 * * * *', expirarHolds, { timezone: TZ })
  console.log(`⏰ Jobs agendados (lembretes 09:00 ${TZ}, expiração de holds a cada 5min)`)
}

module.exports = { start, enviarLembretes, expirarHolds }
