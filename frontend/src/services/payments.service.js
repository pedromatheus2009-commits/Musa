import api from './api'

export const paymentsService = {
  getStatus: () => api.get('/payments/status').then((r) => r.data),
  createCheckout: () => api.post('/payments/checkout').then((r) => r.data),
  createPortal: () => api.post('/payments/portal').then((r) => r.data),
}
