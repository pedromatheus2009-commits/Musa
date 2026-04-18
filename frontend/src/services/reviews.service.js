import api from './api'

export const reviewsService = {
  list: (profileId) => api.get(`/reviews/${profileId}`).then((r) => r.data),
  create: (profileId, data) => api.post(`/reviews/${profileId}`, data).then((r) => r.data),
}
