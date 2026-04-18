const { z } = require('zod')

const whatsappRegex = /^55\d{10,11}$/

const createProfileSchema = z.object({
  nome: z.string().min(2).max(100),
  role: z.string().min(2).max(100),
  bio: z.string().max(1000).optional(),
  cidade: z.string().max(100).optional(),
  whatsapp: z
    .string()
    .transform((v) => {
      const digits = v.replace(/\D/g, '')
      return digits.startsWith('55') ? digits : `55${digits}`
    })
    .pipe(z.string().regex(whatsappRegex, 'WhatsApp inválido. Use formato: 5511999999999'))
    .optional(),
  preco: z.string().max(100).optional(),
  services: z.array(z.string().min(1).max(100)).optional(),
  categoria: z.string().max(100).optional(),
})

const updateProfileSchema = createProfileSchema.partial()

module.exports = { createProfileSchema, updateProfileSchema }
