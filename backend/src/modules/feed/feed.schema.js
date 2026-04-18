const { z } = require('zod')

const createFeedPostSchema = z.object({
  titulo: z.string().min(1).max(200),
  conteudo: z.string().max(10000).optional(),
  imagemUrl: z.string().url().optional().or(z.literal('')),
  videoUrl: z.string().url().optional().or(z.literal('')),
  publicado: z.boolean().optional(),
})

const updateFeedPostSchema = z.object({
  titulo: z.string().min(1).max(200).optional(),
  conteudo: z.string().max(10000).optional(),
  imagemUrl: z.string().url().optional().or(z.literal('')),
  videoUrl: z.string().url().optional().or(z.literal('')),
  publicado: z.boolean().optional(),
})

module.exports = { createFeedPostSchema, updateFeedPostSchema }
