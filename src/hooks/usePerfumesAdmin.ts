import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';
import type { FragellaFragrance, ProductRecord, PerfumeStatus } from '../types/perfume';

export const ADMIN_QUERY_KEY = ['products', 'admin'];
const PUBLIC_QUERY_KEY = ['products'];

const invalidateBoth = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: ADMIN_QUERY_KEY });
  qc.invalidateQueries({ queryKey: PUBLIC_QUERY_KEY });
};

export const usePerfumesAdmin = () =>
  useQuery({
    queryKey: ADMIN_QUERY_KEY,
    queryFn: productService.getAllAdmin,
    staleTime: 0,
  });

export const useAddFromFragella = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      fragellaId,
      fragrance,
      businessData,
    }: {
      fragellaId: string;
      fragrance: FragellaFragrance;
      businessData: {
        price: string;
        stock_status: PerfumeStatus;
        stock_qty?: number;
        notes_admin?: string;
      };
    }) => productService.addFromFragella(fragellaId, fragrance, businessData),
    onSuccess: () => invalidateBoth(qc),
  });
};

export const useUpdateProductBusiness = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<Pick<ProductRecord, 'price' | 'stock_status' | 'stock_qty' | 'active' | 'notes_admin' | 'order_pos'>>;
    }) => productService.updateBusiness(id, data),
    onSuccess: () => invalidateBoth(qc),
  });
};

export const useSetActivePerfume = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      productService.setActive(id, active),
    onSuccess: () => invalidateBoth(qc),
  });
};

export const useDeletePerfumeAdmin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productService.delete(id),
    onSuccess: () => invalidateBoth(qc),
  });
};
