const multer = require('multer')

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']
const MAX_IMAGE_SIZE = 5 * 1024 * 1024   // 5 MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024 // 100 MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter(_req, file, cb) {
    if (IMAGE_TYPES.includes(file.mimetype)) cb(null, true)
    else cb(new Error('Apenas imagens JPEG, PNG ou WebP são permitidas'))
  },
})

const uploadVideo = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_VIDEO_SIZE },
  fileFilter(_req, file, cb) {
    if (VIDEO_TYPES.includes(file.mimetype)) cb(null, true)
    else cb(new Error('Apenas vídeos MP4, WebM ou MOV são permitidos'))
  },
})

module.exports = { upload, uploadVideo }
