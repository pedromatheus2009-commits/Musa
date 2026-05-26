import api from './api'

export const eventosService = {
  // público
  listAgenda: (params) => api.get('/eventos', { params }).then((r) => r.data),
  getEvento: (id) => api.get(`/eventos/${id}`).then((r) => r.data),
  checkout: (id, dados) => api.post(`/eventos/${id}/checkout`, dados).then((r) => r.data),
  // admin
  listAdmin: () => api.get('/eventos/admin/lista').then((r) => r.data),
  create: (data) => api.post('/eventos', data).then((r) => r.data),
  update: (id, data) => api.put(`/eventos/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/eventos/${id}`),
  listInscricoes: (id) => api.get(`/eventos/${id}/inscricoes`).then((r) => r.data),
  addManual: (id, dados) => api.post(`/eventos/${id}/inscricoes/manual`, dados).then((r) => r.data),
  uploadFoto: (file) => { const fd = new FormData(); fd.append('imagem', file); return api.post('/upload/post-image', fd).then((r) => r.data) },
}
