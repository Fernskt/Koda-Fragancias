import { create } from 'zustand';
import type { FilterState } from '../types/perfume';

interface FilterStore extends FilterState {
  setSearch: (v: string) => void;
  setBrand: (v: string) => void;
  setStatus: (v: string) => void;
  setGender: (v: string) => void;
  setFamily: (v: string) => void;
  setUse: (v: string) => void;
  reset: () => void;
}

export const defaults: FilterState = {
  search: '',
  brand: 'Todas',
  status: 'Todos',
  gender: 'Todos',
  family: 'Todas',
  use: 'Todos',
};

export const useFilterStore = create<FilterStore>((set) => ({
  ...defaults,
  setSearch: (v) => set({ search: v }),
  setBrand: (v) => set({ brand: v }),
  setStatus: (v) => set({ status: v }),
  setGender: (v) => set({ gender: v }),
  setFamily: (v) => set({ family: v }),
  setUse: (v) => set({ use: v }),
  reset: () => set(defaults),
}));

export const useHasActiveFilters = () =>
  useFilterStore(
    (s) =>
      s.search !== defaults.search ||
      s.brand !== defaults.brand ||
      s.status !== defaults.status ||
      s.gender !== defaults.gender ||
      s.family !== defaults.family ||
      s.use !== defaults.use
  );
