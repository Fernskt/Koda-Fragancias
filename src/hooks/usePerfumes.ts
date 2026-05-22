import { perfumes } from '../data/perfumes';
import type { Perfume } from '../types/perfume';

// TODO: replace with useQuery from TanStack + Supabase client
export function usePerfumes(): { data: Perfume[]; isLoading: boolean; error: null } {
  return { data: perfumes, isLoading: false, error: null };
}
