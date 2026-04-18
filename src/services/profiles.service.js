import api from './api'

export const profilesService = {
  list: (params) => api.get('/profiles', { params }).then((r) => r.data),
  getOne: (id) => api.get(`/profiles/${id}`).then((r) => r.data),
  getMe: () => api.get('/profiles/me').then((r) => r.data),
  create: (data) => api.post('/profiles', data).then((r) => r.data),
  update: (id, data) => api.put(`/profiles/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/profiles/${id}`),
  uploadAvatar: (file) => {
    const form = new FormData()
    form.append('foto', file)
    return api.post('/upload/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data)
  },
}
