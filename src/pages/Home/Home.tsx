import { useMemo } from 'react';
import { Sparkles, Clock3 } from 'lucide-react';
import { Hero } from '../../components/features/hero/Hero';
import { CatalogGrid } from '../../components/features/catalog/CatalogGrid';
import { HighlightSection } from '../../components/features/catalog/HighlightSection';
import { Divider } from '../../components/ui/Divider';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { usePerfumes } from '../../hooks/usePerfumes';
import { useFilters } from '../../hooks/useFilters';
import { useHasActiveFilters } from '../../store/filterStore';
import { getNewArrivals } from '../../utils/newArrivals';

export function Home() {
  const { data = [], isLoading, isError, refetch } = usePerfumes();
  const filtered = useFilters(data);
  const hasActiveFilters = useHasActiveFilters();

  const destacados = useMemo(() => data.filter((p) => p.featured), [data]);

  const novedades = useMemo(() => getNewArrivals(data), [data]);

  return (
    <PageWrapper>
      {!hasActiveFilters && (
        <>
          <Hero />
          <Divider />
          <HighlightSection title="Destacados" icon={Sparkles} perfumes={destacados} />
          <HighlightSection title="Novedades" icon={Clock3} perfumes={novedades} />
        </>
      )}
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
