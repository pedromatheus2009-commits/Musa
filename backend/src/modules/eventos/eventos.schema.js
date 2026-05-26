const { z } = require('zod')

const whatsappRegex = /^55\d{10,11}$/
const normalizeWa = (v) => {
  const d = String(v).replace(/\D/g, '')
  return d.startsWith('55') ? d : `55${d}`
}
const waRequired = z.string().transform(normalizeWa).pipe(z.string().regex(whatsappRegex, 'WhatsApp inválido. Use 5511999999999'))
const waOptional = z.string().transform(normalizeWa).pipe(z.string().regex(whatsappRegex, 'WhatsApp inválido. Use 5511999999999')).optional()

const createEventoSchema = z.object({
  tipo: z.enum(['oficina', 'aula', 'evento']),
  titulo: z.string().min(2).max(200),
  descricao: z.string().max(5000).optional(),
  dataHora: z.coerce.date(),
  duracaoMin: z.number().int().positive().optional(),
  local: z.string().max(300).optional(),
  online: z.boolean().optional(),
  linkOnline: z.string().url().max(500).optional().or(z.literal('')),
  preco: z.number().int().min(0), // em centavos (BRL)
  vagas: z.number().int().positive(),
  imagemUrl: z.string().url().max(1000).optional().or(z.literal('')),
  status: z.enum(['rascunho', 'publicado', 'lotado', 'encerrado', 'cancelado']).optional(),
})

const updateEventoSchema = createEventoSchema.partial()

const checkoutSchema = z.object({
  nome: z.string().min(2).max(150),
  email: z.string().email().max(200),
  whatsapp: waRequired,
})

const inscricaoManualSchema = z.object({
  nome: z.string().min(2).max(150),
  email: z.string().email().max(200).optional(),
  whatsapp: waOptional,
})

module.exports = { createEventoSchema, updateEventoSchema, checkoutSchema, inscricaoManualSchema }
