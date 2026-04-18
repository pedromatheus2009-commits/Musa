const router = require('express').Router()
const { verifyJWT } = require('../../middleware/auth')
const { upload, uploadVideo } = require('../../middleware/upload')
const { uploadAvatar, uploadPostImage, uploadPostVideo } = require('./upload.controller')

router.post('/avatar', verifyJWT, upload.single('foto'), uploadAvatar)
router.post('/post-image', verifyJWT, upload.single('imagem'), uploadPostImage)
router.post('/post-video', verifyJWT, uploadVideo.single('video'), uploadPostVideo)

module.exports = router
