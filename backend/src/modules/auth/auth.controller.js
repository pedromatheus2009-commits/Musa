const authService = require('./auth.service')

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body)
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

async function me(req, res, next) {
  try {
    const user = await authService.me(req.user.sub)
    res.json(user)
  } catch (err) {
    next(err)
  }
}

async function forgotPassword(req, res, next) {
  try {
    await authService.forgotPassword(req.body.email)
    res.json({ message: 'Se este email estiver cadastrado, você receberá um link em breve.' })
  } catch (err) {
    next(err)
  }
}

async function resetPassword(req, res, next) {
  try {
    await authService.resetPassword(req.body.token, req.body.password)
    res.json({ message: 'Senha redefinida com sucesso!' })
  } catch (err) {
    next(err)
  }
}

module.exports = { register, login, me, forgotPassword, resetPassword }
