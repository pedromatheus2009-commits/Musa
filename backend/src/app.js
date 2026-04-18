require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

const app = express()

app.use(helmet())
const corsOrigin = process.env.NODE_ENV === 'development'
  ? (origin, cb) => cb(null, true)
  : process.env.CORS_ORIGIN
app.use(cors({ origin: corsOrigin, credentials: true }))

// Payments (webhook precisa de raw body — deve vir antes do express.json())
app.use('/api/payments', require('./modules/payments/payments.routes'))

app.use(express.json())

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

// Routes
app.use('/api/auth', require('./modules/auth/auth.routes'))
app.use('/api/profiles', require('./modules/profiles/profiles.routes'))
app.use('/api/upload', require('./modules/upload/upload.routes'))
app.use('/api/contact', require('./modules/contact/contact.routes'))
app.use('/api/reviews', require('./modules/reviews/reviews.routes'))
app.use('/api/posts', require('./modules/posts/posts.routes'))
app.use('/api/feed', require('./modules/feed/feed.routes'))
app.use('/api/admin', require('./modules/admin/admin.routes'))
app.use('/api/partnerships', require('./modules/partnerships/partnerships.routes'))

// 404
app.use((_req, res) => res.status(404).json({ error: 'Rota não encontrada' }))

// Global error handler
app.use((err, _req, res, _next) => {
  const status = err.status || 500
  const message = status < 500 ? err.message : 'Erro interno do servidor'
  if (status >= 500) console.error(err)
  res.status(status).json({ error: message })
})

module.exports = app
