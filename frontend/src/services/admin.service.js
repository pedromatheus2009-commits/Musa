import api from './api'

export const adminService = {
  getStats: () => api.get('/admin/stats').then((r) => r.data),
  listProfiles: (params) => api.get('/admin/profiles', { params }).then((r) => r.data),
  approveProfile: (id) => api.put(`/admin/profiles/${id}/approve`).then((r) => r.data),
  rejectProfile: (id) => api.put(`/admin/profiles/${id}/reject`).then((r) => r.data),
  deleteProfile: (id) => api.delete(`/admin/profiles/${id}`),
}
