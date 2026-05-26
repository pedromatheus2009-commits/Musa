const { z } = require('zod')

const createPartnershipSchema = z.object({
  nome: z.string().min(2).max(200),
  empresa: z.string().min(1).max(200),
  email: z.string().email().max(200),
  tipo: z.string().min(1).max(100),
  mensagem: z.string().min(1).max(3000),
})

module.exports = { createPartnershipSchema }
