import { useMemo } from 'react';
import { Hero } from '../../components/features/hero/Hero';
import { FilterBar } from '../../components/features/catalog/FilterBar';
import { CatalogGrid } from '../../components/features/catalog/CatalogGrid';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { useCatalogProducts } from '../../hooks/useCatalogProducts';
import { useFilters } from '../../hooks/useFilters';
import { toCatalogDisplay } from '../../utils/catalogHelpers';

export function Home() {
  const { data: catalogProducts, isLoading, error } = useCatalogProducts();

  const displayProducts = useMemo(
    () => catalogProducts.map(toCatalogDisplay),
    [catalogProducts]
  );

  const filtered = useFilters(displayProducts);

  return (
    <PageWrapper>
      <Hero />
      <FilterBar perfumes={displayProducts} />
      <main>
        <CatalogGrid
          perfumes={filtered}
          isLoading={isLoading}
          isError={!!error}
        />
      </main>
    </PageWrapper>
  );
}
