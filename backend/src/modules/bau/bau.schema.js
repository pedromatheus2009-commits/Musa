const { z } = require('zod')

const whatsappRegex = /^55\d{10,11}$/
const normalizeWa = (v) => {
  const d = String(v).replace(/\D/g, '')
  return d.startsWith('55') ? d : `55${d}`
}
const waRequired = z.string().transform(normalizeWa).pipe(z.string().regex(whatsappRegex, 'WhatsApp inválido. Use 5511999999999'))

const createBauSchema = z.object({
  titulo: z.string().min(2).max(150),
  descricao: z.string().max(3000).optional(),
  tipo: z.enum(['venda', 'troca']),
  preco: z.number().int().min(0).optional().nullable(), // centavos; ausente em trocas
  categoria: z.string().max(100).optional(),
  fotos: z.array(z.string().url()).max(6).optional(),
  whatsapp: waRequired,
})

const updateBauSchema = createBauSchema.partial()

module.exports = { createBauSchema, updateBauSchema }
