import api from './api'

export const postsService = {
  listByProfile: (profileId) => api.get(`/posts/profile/${profileId}`).then((r) => r.data),
  create: (data) => api.post('/posts', data).then((r) => r.data),
  update: (id, data) => api.put(`/posts/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/posts/${id}`),
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
