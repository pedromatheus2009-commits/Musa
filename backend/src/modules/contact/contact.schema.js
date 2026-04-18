const { z } = require('zod')

const contactSchema = z.object({
  nome: z.string().min(2).max(100),
  email: z.string().email('Email inválido'),
  mensagem: z.string().min(10).max(2000),
})

module.exports = { contactSchema }
