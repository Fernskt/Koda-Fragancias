import { useMemo } from 'react';
import { useFilterStore } from '../store/filterStore';
import { normalize } from '../utils/normalize';
import type { Perfume } from '../types/perfume';

const STATUS_ORDER: Record<string, number> = {
  Disponible: 0,
  'Última unidad': 1,
  'Sin stock': 2,
};

export function useFilters(perfumes: Perfume[]) {
  const { search, brand, status, gender, family, use } = useFilterStore();

  const filtered = useMemo(() => {
    const q = normalize(search);
    const brandFilter = brand === 'Todas' ? '' : brand;
    const statusFilter = status === 'Todos' ? '' : status;

    return perfumes
      .filter((p) => {
        const blob = normalize(
          [p.name, p.brand, p.type, p.gender, p.status, p.notes, ...p.family, ...p.use].join(' ')
        );
        const matchSearch = !q || blob.includes(q);
        const matchBrand = !brandFilter || p.brand === brandFilter;
        const matchStatus = !statusFilter || p.status === statusFilter;
        const matchGender =
          gender === 'Todos' ||
          (gender === 'Para empezar' ? !!p.starter : p.gender === gender || (gender === 'Mujer' && p.gender === 'Femenino'));
        const matchFamily = family === 'Todas' || p.family.includes(family);
        const matchUse = use === 'Todos' || p.use.includes(use);
        return matchSearch && matchBrand && matchStatus && matchGender && matchFamily && matchUse;
      })
      .sort((a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9));
  }, [perfumes, search, brand, status, gender, family, use]);

  return filtered;
}
