const { Resend } = require('resend')

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

async function sendContact(req, res) {
  const { nome, email, mensagem } = req.body

  if (!process.env.RESEND_API_KEY) {
    console.log('📧 [DEV] Contato recebido:', { nome, email, mensagem })
    return res.json({ message: 'Mensagem recebida com sucesso!' })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: 'MUSA <noreply@musacasa.com.br>',
    to: process.env.CONTACT_TO_EMAIL,
    subject: `Nova mensagem de contato — ${String(nome ?? '').replace(/[\r\n]/g, ' ').slice(0, 120)}`,
    html: `<p><strong>Nome:</strong> ${esc(nome)}</p><p><strong>Email:</strong> ${esc(email)}</p><p><strong>Mensagem:</strong><br>${esc(mensagem).replace(/\n/g, '<br>')}</p>`,
    replyTo: email,
  })

  if (error) return res.status(500).json({ error: 'Falha ao enviar mensagem' })
  res.json({ message: 'Mensagem enviada com sucesso!' })
}

module.exports = { sendContact }
