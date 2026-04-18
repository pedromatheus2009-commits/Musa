const { z } = require('zod')

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
  nome: z.string().min(2, 'Nome muito curto').max(100),
})

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
})

const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
})

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

module.exports = { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema }
