import api from './api'

export const bauService = {
  // público
  listPublico: (params) => api.get('/bau', { params }).then((r) => r.data),
  detalhe: (id) => api.get(`/bau/${id}`).then((r) => r.data),
  // usuária
  criar: (data) => api.post('/bau', data).then((r) => r.data),
  meus: () => api.get('/bau/meus').then((r) => r.data),
  atualizar: (id, data) => api.put(`/bau/${id}`, data).then((r) => r.data),
  marcarVendido: (id) => api.put(`/bau/${id}/vendido`).then((r) => r.data),
  remover: (id) => api.delete(`/bau/${id}`),
  uploadFoto: (file) => {
    const fd = new FormData()
    fd.append('imagem', file)
    return api.post('/upload/post-image', fd).then((r) => r.data)
  },
  // admin
  listAdmin: (status) => api.get('/bau/admin/lista', { params: status ? { status } : {} }).then((r) => r.data),
  aprovar: (id) => api.put(`/bau/${id}/aprovar`).then((r) => r.data),
  recusar: (id) => api.put(`/bau/${id}/recusar`).then((r) => r.data),
}
