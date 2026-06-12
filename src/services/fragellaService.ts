import type { FragellaFragrance } from '../types/perfume';

const BASE_URL = 'https://api.fragella.com/api/v1';
const API_KEY = import.meta.env.VITE_FRAGELLA_API_KEY as string;

const headers = {
  'x-api-key': API_KEY,
  'Content-Type': 'application/json',
};

export const fragellaService = {
  async search(query: string, limit = 10): Promise<FragellaFragrance[]> {
    try {
      const url = `${BASE_URL}/fragrances?search=${encodeURIComponent(query)}&limit=${limit}`;
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error(`Fragella search: HTTP ${res.status}`);
      return (await res.json()) as FragellaFragrance[];
    } catch (err) {
      console.error('[fragellaService.search]', err);
      return [];
    }
  },

  async getById(id: string): Promise<FragellaFragrance | null> {
    try {
      const res = await fetch(`${BASE_URL}/fragrances/${encodeURIComponent(id)}`, { headers });
      if (!res.ok) throw new Error(`Fragella getById: HTTP ${res.status}`);
      return (await res.json()) as FragellaFragrance;
    } catch (err) {
      console.error(`[fragellaService.getById] ${id}`, err);
      return null;
    }
  },

  async getManyByIds(ids: string[]): Promise<Record<string, FragellaFragrance>> {
    const results = await Promise.allSettled(
      ids.map((id) => fragellaService.getById(id))
    );
    const map: Record<string, FragellaFragrance> = {};
    results.forEach((result, i) => {
      if (result.status === 'fulfilled' && result.value !== null) {
        map[ids[i]] = result.value;
      }
    });
    return map;
  },
};
