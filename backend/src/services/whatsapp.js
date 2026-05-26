// Integração WhatsApp via Meta Cloud API (oficial).
// Enquanto WHATSAPP_TOKEN / WHATSAPP_PHONE_NUMBER_ID não estiverem configurados,
// roda em modo "simulado" (apenas loga), para o restante do sistema funcionar
// normalmente antes da Meta aprovar a conta e os templates.
const TOKEN = process.env.WHATSAPP_TOKEN
const PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID
const API_VERSION = process.env.WHATSAPP_API_VERSION || 'v21.0'
const LANG = process.env.WHATSAPP_LANG || 'pt_BR'
const ADMIN_WA = process.env.ADMIN_WHATSAPP

const TPL = {
  confirmacao: process.env.WHATSAPP_TPL_CONFIRMACAO || 'confirmacao_compra',
  lembrete: process.env.WHATSAPP_TPL_LEMBRETE || 'lembrete_evento',
  adminInscricao: process.env.WHATSAPP_TPL_ADMIN_INSCRICAO || 'admin_nova_inscricao',
  adminLotado: process.env.WHATSAPP_TPL_ADMIN_LOTADO || 'admin_evento_lotado',
}

const configured = Boolean(TOKEN && PHONE_ID)

const fmtData = (d) => new Date(d).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

async function sendTemplate(to, templateName, params = []) {
  if (!to) return
  if (!configured) {
    console.log(`[whatsapp:simulado] -> ${to} | template=${templateName} | params=${JSON.stringify(params)}`)
    return
  }
  const body = {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: templateName,
      language: { code: LANG },
      components: params.length
        ? [{ type: 'body', parameters: params.map((t) => ({ type: 'text', text: String(t) })) }]
        : [],
    },
  }
  try {
    const res = await fetch(`https://graph.facebook.com/${API_VERSION}/${PHONE_ID}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) console.error(`[whatsapp] erro ${res.status}: ${await res.text()}`)
  } catch (e) {
    console.error('[whatsapp] falha de rede:', e.message)
  }
}

function enviarConfirmacaoCompra(inscricao, evento) {
  return sendTemplate(inscricao.whatsapp, TPL.confirmacao, [inscricao.nome, evento.titulo, fmtData(evento.dataHora), evento.local || (evento.online ? 'Online' : 'A definir')])
}
function enviarLembrete(inscricao, evento) {
  return sendTemplate(inscricao.whatsapp, TPL.lembrete, [inscricao.nome, evento.titulo, fmtData(evento.dataHora), evento.local || (evento.online ? 'Online' : 'A definir')])
}
function notificarAdminNovaInscricao(inscricao, evento) {
  return sendTemplate(ADMIN_WA, TPL.adminInscricao, [evento.titulo, inscricao.nome])
}
function notificarAdminLotado(evento) {
  return sendTemplate(ADMIN_WA, TPL.adminLotado, [evento.titulo])
}

module.exports = { configured, enviarConfirmacaoCompra, enviarLembrete, notificarAdminNovaInscricao, notificarAdminLotado }
