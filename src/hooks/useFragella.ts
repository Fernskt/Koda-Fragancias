import { useQuery } from '@tanstack/react-query';
import { fragellaService } from '../services/fragellaService';
import type { ProductRecord } from '../types/perfume';

export const useFragellaSearch = (query: string) => {
  return useQuery({
    queryKey: ['fragella', 'search', query],
    queryFn: () => fragellaService.search(query),
    enabled: query.trim().length >= 2,
    staleTime: 1000 * 60 * 10,
    placeholderData: [],
  });
};

export const useFragellaBatch = (products: ProductRecord[]) => {
  const ids = products.map((p) => p.fragella_id);
  return useQuery({
    queryKey: ['fragella', 'catalog', ids],
    queryFn: () => fragellaService.getManyByIds(ids),
    enabled: ids.length > 0,
    staleTime: 1000 * 60 * 10,
  });
};
