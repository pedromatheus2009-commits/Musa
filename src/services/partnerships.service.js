import api from './api'

export const partnershipsService = {
  send: (data) => api.post('/partnerships', data).then((r) => r.data),
  list: (params) => api.get('/partnerships', { params }).then((r) => r.data),
  markRead: (id) => api.put(`/partnerships/${id}/read`).then((r) => r.data),
  remove: (id) => api.delete(`/partnerships/${id}`),
}
