import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { productService } from '../services/productService';
import { fragellaService } from '../services/fragellaService';
import type { CatalogProduct, ProductRecord } from '../types/perfume';

export const useCatalogProducts = () => {
  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAll,
    staleTime: 1000 * 60 * 5,
  });

  const ids = productsQuery.data?.map((p) => p.fragella_id) ?? [];

  const fragellaQuery = useQuery({
    queryKey: ['fragella', 'catalog', ids],
    queryFn: () => fragellaService.getManyByIds(ids),
    enabled: ids.length > 0,
    staleTime: 1000 * 60 * 10,
  });

  const data: CatalogProduct[] = useMemo(() => {
    if (!productsQuery.data) return [];
    return productsQuery.data
      .map((product: ProductRecord) => {
        const fragrance =
          fragellaQuery.data?.[product.fragella_id] ??
          product.fragella_cache ??
          null;
        if (!fragrance) return null;
        return { ...product, fragrance };
      })
      .filter((p): p is CatalogProduct => p !== null);
  }, [productsQuery.data, fragellaQuery.data]);

  return {
    data,
    isLoading: productsQuery.isLoading,
    error: productsQuery.error,
  };
};
