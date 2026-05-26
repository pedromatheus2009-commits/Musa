require('dotenv').config()
const app = require('./app')

const required = ['DATABASE_URL', 'JWT_SECRET']
if (process.env.NODE_ENV === 'production') required.push('STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'CORS_ORIGIN')
const missing = required.filter((k) => !process.env[k])
if (missing.length) {
  console.error(`❌ Variáveis de ambiente obrigatórias ausentes: ${missing.join(', ')}`)
  process.exit(1)
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`🚀 MUSA API rodando em http://localhost:${PORT}`)
  console.log(`   Health: http://localhost:${PORT}/api/health`)
  if (process.env.DISABLE_JOBS !== 'true') {
    require('./jobs').start()
  }
})
