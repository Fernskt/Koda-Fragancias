import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { perfumeService } from '../services/perfumeService';
import { storeConfigService } from '../services/storeConfigService';
import type { Perfume } from '../types/perfume';

export const ADMIN_QUERY_KEY = ['perfumes', 'admin'];
const PUBLIC_QUERY_KEY = ['perfumes'];

const invalidateBoth = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: ADMIN_QUERY_KEY });
  qc.invalidateQueries({ queryKey: PUBLIC_QUERY_KEY });
};

const touchCatalogDate = (qc: ReturnType<typeof useQueryClient>) => {
  storeConfigService
    .touchCatalogUpdatedAt()
    .then(() => qc.invalidateQueries({ queryKey: ['store_config'] }))
    .catch((err) => console.error('No se pudo actualizar la fecha del catálogo', err));
};

export const usePerfumesAdmin = () =>
  useQuery({
    queryKey: ADMIN_QUERY_KEY,
    queryFn: perfumeService.getAllAdmin,
    staleTime: 0,
  });

export const useCreatePerfumeAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (perfume: Omit<Perfume, 'id'>) => perfumeService.create(perfume),
    onSuccess: () => {
      invalidateBoth(qc);
      touchCatalogDate(qc);
    },
  });
};

export const useUpdatePerfumeAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Perfume, 'id'>> }) =>
      perfumeService.update(id, data),
    onSuccess: (_result, { data }) => {
      invalidateBoth(qc);
      if (data.price !== undefined || data.status !== undefined) {
        touchCatalogDate(qc);
      }
    },
  });
};

export const useSetActivePerfume = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      perfumeService.setActive(id, active),
    onSuccess: () => invalidateBoth(qc),
  });
};

export const useDeletePerfumeAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => perfumeService.delete(id),
    onSuccess: () => invalidateBoth(qc),
  });
};
