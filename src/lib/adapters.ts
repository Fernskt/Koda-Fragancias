import type { Perfume } from '../types/perfume';
import type { Database } from './database.types';

type PerfumeRow = Database['public']['Tables']['perfumes']['Row'];

export function adaptPerfumeFromDB(row: PerfumeRow): Perfume {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    type: row.type,
    gender: row.gender,
    family: row.family,
    use: row.use_cases,          // <-- mapeo clave
    notes: row.notes,
    price: row.price,
    status: row.status,
    image: row.image ?? undefined,
    fragranticaUrl: row.fragrantica_url ?? undefined,
    fragranticaName: row.fragrantica_name ?? undefined,
    verification: row.verification ?? undefined,
    starter: row.starter,
    active: row.active,
  };
}

export function adaptPerfumeToDB(
  perfume: Omit<Perfume, 'id'>
): Database['public']['Tables']['perfumes']['Insert'] {
  return {
    name: perfume.name,
    brand: perfume.brand,
    type: perfume.type,
    gender: perfume.gender,
    family: perfume.family,
    use_cases: perfume.use,      // <-- mapeo inverso
    notes: perfume.notes,
    price: perfume.price,
    status: perfume.status,
    image: perfume.image ?? null,
    fragrantica_url: perfume.fragranticaUrl ?? null,
    fragrantica_name: perfume.fragranticaName ?? null,
    verification: perfume.verification ?? null,
    starter: perfume.starter,
    active: true,
  };
}