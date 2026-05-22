import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { perfumeService } from '../services/perfumeService';
import type { Perfume } from '../types/perfume';

const QUERY_KEY = ['perfumes'];

export const usePerfumes = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: perfumeService.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  });
};

export const useUpdateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: Perfume['status'] }) =>
      perfumeService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useCreatePerfume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (perfume: Omit<Perfume, 'id'>) => perfumeService.create(perfume),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useUpdatePerfume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Perfume, 'id'>> }) =>
      perfumeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useDeletePerfume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => perfumeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};