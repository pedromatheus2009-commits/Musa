const { z } = require('zod')

const createPostSchema = z.object({
  titulo: z.string().max(200).optional(),
  conteudo: z.string().max(5000).optional(),
  imagemUrl: z.string().url().optional().or(z.literal('')),
  videoUrl: z.string().url().optional().or(z.literal('')),
}).refine((d) => d.titulo || d.conteudo || d.imagemUrl || d.videoUrl, {
  message: 'Informe pelo menos um título, texto, imagem ou vídeo',
})

const updatePostSchema = z.object({
  titulo: z.string().max(200).optional(),
  conteudo: z.string().max(5000).optional(),
  imagemUrl: z.string().url().optional().or(z.literal('')),
  videoUrl: z.string().url().optional().or(z.literal('')),
})

module.exports = { createPostSchema, updatePostSchema }
