const { createClient } = require('@supabase/supabase-js')
const { v4: uuidv4 } = require('crypto')

async function uploadAvatar(req, res) {
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' })

  const ext = req.file.mimetype.split('/')[1].replace('jpeg', 'jpg')
  const filename = `avatars/${req.user.sub}-${Date.now()}.${ext}`

  // Em dev sem Supabase configurado, retorna placeholder
  if (!process.env.SUPABASE_URL) {
    return res.json({ url: `https://api.dicebear.com/7.x/initials/svg?seed=${req.user.sub}` })
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
  const { error } = await supabase.storage
    .from(process.env.SUPABASE_STORAGE_BUCKET)
    .upload(filename, req.file.buffer, { contentType: req.file.mimetype })

  if (error) return res.status(500).json({ error: 'Falha no upload' })

  const { data: { publicUrl } } = supabase.storage
    .from(process.env.SUPABASE_STORAGE_BUCKET)
    .getPublicUrl(filename)

  res.json({ url: publicUrl })
}

async function uploadPostImage(req, res) {
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' })

  const ext = req.file.mimetype.split('/')[1].replace('jpeg', 'jpg')
  const filename = `posts/${req.user.sub}-${Date.now()}.${ext}`

  if (!process.env.SUPABASE_URL) {
    return res.json({ url: `https://picsum.photos/seed/${Date.now()}/800/600` })
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
  const { error } = await supabase.storage
    .from(process.env.SUPABASE_STORAGE_BUCKET)
    .upload(filename, req.file.buffer, { contentType: req.file.mimetype })

  if (error) return res.status(500).json({ error: 'Falha no upload' })

  const { data: { publicUrl } } = supabase.storage
    .from(process.env.SUPABASE_STORAGE_BUCKET)
    .getPublicUrl(filename)

  res.json({ url: publicUrl })
}

async function uploadPostVideo(req, res) {
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' })

  const ext = req.file.mimetype.split('/')[1]
  const filename = `videos/${req.user.sub}-${Date.now()}.${ext}`

  if (!process.env.SUPABASE_URL) {
    // Dev placeholder — return a sample video URL
    return res.json({ url: 'https://www.w3schools.com/html/mov_bbb.mp4' })
  }

  const { createClient } = require('@supabase/supabase-js')
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
  const { error } = await supabase.storage
    .from(process.env.SUPABASE_STORAGE_BUCKET)
    .upload(filename, req.file.buffer, { contentType: req.file.mimetype })

  if (error) return res.status(500).json({ error: 'Falha no upload do vídeo' })

  const { data: { publicUrl } } = supabase.storage
    .from(process.env.SUPABASE_STORAGE_BUCKET)
    .getPublicUrl(filename)

  res.json({ url: publicUrl })
}

module.exports = { uploadAvatar, uploadPostImage, uploadPostVideo }
