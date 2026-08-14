import type { Perfume } from '../types/perfume';

export const NEW_ARRIVALS_COUNT = 8;

export function getNewArrivals(perfumes: Perfume[]): Perfume[] {
  return [...perfumes]
    .filter((p) => p.active !== false && p.status !== 'Sin stock' && !!p.createdAt)
    .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
    .slice(0, NEW_ARRIVALS_COUNT);
}
