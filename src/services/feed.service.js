import api from './api'

export const feedService = {
  list: () => api.get('/feed').then((r) => r.data),
  listAll: () => api.get('/feed/admin/all').then((r) => r.data),
  getOne: (id) => api.get(`/feed/${id}`).then((r) => r.data),
  create: (data) => api.post('/feed', data).then((r) => r.data),
  update: (id, data) => api.put(`/feed/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/feed/${id}`),
  uploadImage: (file) => {
    const form = new FormData()
    form.append('imagem', file)
    return api.post('/upload/post-image', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data)
  },
  uploadVideo: (file) => {
    const form = new FormData()
    form.append('video', file)
    return api.post('/upload/post-video', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data)
  },
}
