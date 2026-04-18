import { useQuery } from '@tanstack/react-query'
import { profilesService } from '../services/profiles.service'

export function useProfessionals(filters = {}) {
  return useQuery({
    queryKey: ['professionals', filters],
    queryFn: () => profilesService.list(filters),
    staleTime: 30_000,
  })
}

export function useProfessional(id) {
  return useQuery({
    queryKey: ['professional', id],
    queryFn: () => profilesService.getOne(id),
    enabled: !!id,
  })
}
