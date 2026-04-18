const { Resend } = require('resend')

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
    subject: `Nova mensagem de contato — ${nome}`,
    html: `<p><strong>Nome:</strong> ${nome}</p><p><strong>Email:</strong> ${email}</p><p><strong>Mensagem:</strong><br>${mensagem}</p>`,
    replyTo: email,
  })

  if (error) return res.status(500).json({ error: 'Falha ao enviar mensagem' })
  res.json({ message: 'Mensagem enviada com sucesso!' })
}

module.exports = { sendContact }
