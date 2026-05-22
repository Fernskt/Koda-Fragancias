import { Hero } from '../../components/features/hero/Hero';
import { FilterBar } from '../../components/features/catalog/FilterBar';
import { CatalogGrid } from '../../components/features/catalog/CatalogGrid';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { usePerfumes } from '../../hooks/usePerfumes';
import { useFilters } from '../../hooks/useFilters';

export function Home() {
  const { data = [], isLoading, isError, refetch } = usePerfumes();
  const filtered = useFilters(data);

  return (
    <PageWrapper>
      <Hero />
      <FilterBar perfumes={data} />
      <main>
        <CatalogGrid
          perfumes={filtered}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
      </main>
    </PageWrapper>
  );
}
