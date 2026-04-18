const router = require('express').Router()
const { validate } = require('../../middleware/validate')
const { contactSchema } = require('./contact.schema')
const { sendContact } = require('./contact.controller')

router.post('/', validate(contactSchema), sendContact)

module.exports = router
